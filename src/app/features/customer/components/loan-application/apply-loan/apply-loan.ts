import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { LoanTypeService } from '../../../../admin/services/loan-type';
import { LoanApplicationService } from '../../../services/loan-application';
import { LoanType } from '../../../../../shared/models';

@Component({
  selector: 'app-apply-loan',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './apply-loan.html',
  styleUrls: ['./apply-loan.css']
})
export class ApplyLoanComponent implements OnInit, OnDestroy {
  loanForm!: FormGroup;
  loanTypes: LoanType[] = [];
  selectedLoanType: LoanType | null = null;

  isLoading = false;
  isLoadingTypes = true;
  calculatedEMI = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private loanTypeService: LoanTypeService,
    private loanApplicationService: LoanApplicationService,
    private router: Router,
    private toastr: ToastrService, 
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadLoanTypes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.loanForm = this.fb.group({
      loanTypeId: ['', Validators.required],
      loanAmount: ['', [Validators.required, Validators.min(10000)]],
      tenure: ['', [Validators.required, Validators.min(6)]],
      annualIncome: ['', [Validators.required, Validators.min(0)]],
      employmentScore: [50, [Validators.min(0), Validators.max(100)]]
    });

    this.loanForm
      .get('loanTypeId')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(id => this.onLoanTypeChange(id));

    this.loanForm
      .get('loanAmount')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateEMI());

    this.loanForm
      .get('tenure')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateEMI());
  }

  private loadLoanTypes(): void {
    this.loanTypeService.getAllActiveLoanTypes().subscribe({
      next: types => {
        this.loanTypes = types;
        this.isLoadingTypes = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoadingTypes = false;
      }
    });
  }

  onLoanTypeChange(typeId: string): void {
    this.selectedLoanType = this.loanTypes.find(t => t.id === +typeId) || null;

    if (this.selectedLoanType) {
      this.loanForm.patchValue({
        loanAmount: this.selectedLoanType.minAmount,
        tenure: this.selectedLoanType.minTenure
      });
    }

    this.calculateEMI();
  }

  calculateEMI(): void {
    if (!this.selectedLoanType) {
      this.calculatedEMI = 0;
      return;
    }

    const principal = this.loanForm.get('loanAmount')?.value;
    const tenure = this.loanForm.get('tenure')?.value;

    if (!principal || !tenure) {
      this.calculatedEMI = 0;
      return;
    }

    const monthlyRate = this.selectedLoanType.baseInterestRate / 1200;

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);

    this.calculatedEMI = Math.round(emi);
  }

  onSubmit(): void {
    if (this.loanForm.invalid || !this.selectedLoanType) {
      this.loanForm.markAllAsTouched();
      return;
    }

    const { loanAmount, tenure } = this.loanForm.value;

    if (
      loanAmount < this.selectedLoanType.minAmount ||
      loanAmount > this.selectedLoanType.maxAmount
    ) {
      this.toastr.error(
        `Loan amount must be between ₹${this.selectedLoanType.minAmount} and ₹${this.selectedLoanType.maxAmount}`
      );
      return;
    }

    if (
      tenure < this.selectedLoanType.minTenure ||
      tenure > this.selectedLoanType.maxTenure
    ) {
      this.toastr.error(
        `Tenure must be between ${this.selectedLoanType.minTenure} and ${this.selectedLoanType.maxTenure} months`
      );
      return;
    }

    this.isLoading = true;

    this.loanApplicationService.applyLoan(this.loanForm.value).subscribe({
      next: res => {
        this.toastr.success(
          `Loan application submitted successfully! Loan ID: ${res.loanId}`
        );
        this.router.navigate(['/customer/dashboard']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/customer/dashboard']);
  }

  hasError(field: string, error: string): boolean {
    const control = this.loanForm.get(field);
    return !!(
      control &&
      control.hasError(error) &&
      (control.dirty || control.touched)
    );
  }
}
