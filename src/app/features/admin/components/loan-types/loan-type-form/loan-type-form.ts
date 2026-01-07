import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { LoanTypeService } from '../../../services/loan-type';

@Component({
  selector: 'app-loan-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './loan-type-form.html',
  styleUrls: ['./loan-type-form.css']
})
export class LoanTypeFormComponent implements OnInit {
  loanTypeForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  loanTypeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private loanTypeService: LoanTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.detectEditMode();
  }

  private initForm(): void {
    this.loanTypeForm = this.fb.group({
      typeName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      minAmount: [10000, [Validators.required, Validators.min(10000)]],
      maxAmount: [5000000, [Validators.required, Validators.max(5000000)]],
      baseInterestRate: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
      minTenure: [6, [Validators.required, Validators.min(6)]],
      maxTenure: [240, [Validators.required, Validators.max(240)]],
      description: ['', [Validators.maxLength(1000)]],
      isActive: [true]
    });
  }

  private detectEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loanTypeId = +id;
      this.loadLoanType(this.loanTypeId);
    }
  }

  private loadLoanType(id: number): void {
    this.isLoading = true;

    this.loanTypeService.getLoanTypeById(id).subscribe({
      next: data => {
        this.loanTypeForm.patchValue(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/loan-types']);
      }
    });
  }

  onSubmit(): void {
    if (this.loanTypeForm.invalid) {
      this.loanTypeForm.markAllAsTouched();
      return;
    }

    const { minAmount, maxAmount, minTenure, maxTenure } = this.loanTypeForm.value;

    if (minAmount >= maxAmount) {
      this.toastr.error('Maximum amount must be greater than minimum amount');
      return;
    }

    if (minTenure >= maxTenure) {
      this.toastr.error('Maximum tenure must be greater than minimum tenure');
      return;
    }

    this.isLoading = true;

    const request$ = this.isEditMode
      ? this.loanTypeService.updateLoanType(this.loanTypeId!, this.loanTypeForm.value)
      : this.loanTypeService.createLoanType(this.loanTypeForm.value);

    request$.subscribe({
      next: () => {
        this.toastr.success(
          `Loan type ${this.isEditMode ? 'updated' : 'created'} successfully`
        );
        this.router.navigate(['/admin/loan-types']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/loan-types']);
  }

  hasError(field: string, error: string): boolean {
    const control = this.loanTypeForm.get(field);
    return !!(
      control &&
      control.hasError(error) &&
      (control.dirty || control.touched)
    );
  }
}
