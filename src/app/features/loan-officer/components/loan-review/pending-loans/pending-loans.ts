import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

import { LoanApplicationService } from '../../../../customer/services/loan-application';
import { LoanApplication, LoanStatus } from '../../../../../shared/models';

import { LoaderComponent } from '../../../../../shared/components/loader/loader';
import { CurrencyFormatPipe } from '../../../../../shared/pipes/currency-format-pipe';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format-pipe';

@Component({
  selector: 'app-pending-loans',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent,
    CurrencyFormatPipe,
    DateFormatPipe
  ],
  templateUrl: './pending-loans.html',
  styleUrls: ['./pending-loans.css']
})
export class PendingLoansComponent implements OnInit {
  readonly LoanStatus = LoanStatus;

  pendingLoans: LoanApplication[] = [];
  isLoading = true;
  selectedLoan: LoanApplication | null = null;
  showReviewModal = false;
  reviewForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanApplicationService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initReviewForm();
    this.loadPendingLoans();
  }

  private initReviewForm(): void {
    this.reviewForm = this.fb.group({
      status: ['', Validators.required],
      approvedAmount: [null],
      interestRate: [null],
      remarks: ['', Validators.required]
    });

    this.reviewForm.get('status')?.valueChanges.subscribe(status => {
      if (status === LoanStatus.APPROVED) {
        this.reviewForm.get('approvedAmount')?.setValidators([
          Validators.required,
          Validators.min(10000)
        ]);
        this.reviewForm.get('interestRate')?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(50)
        ]);
      } else {
        this.reviewForm.get('approvedAmount')?.clearValidators();
        this.reviewForm.get('interestRate')?.clearValidators();
      }

      this.reviewForm.get('approvedAmount')?.updateValueAndValidity();
      this.reviewForm.get('interestRate')?.updateValueAndValidity();
    });
  }

  loadPendingLoans(): void {
    this.isLoading = true;

    forkJoin({
      applied: this.loanService.getLoansByStatus(LoanStatus.APPLIED),
      underReview: this.loanService.getLoansByStatus(LoanStatus.UNDER_REVIEW)
    }).subscribe({
      next: (results) => {
        this.pendingLoans = [...results.applied, ...results.underReview];
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load pending loans');
        this.isLoading = false;
      }
    });
  }

  openReviewModal(loan: LoanApplication): void {
    this.selectedLoan = loan;
    this.showReviewModal = true;

    this.reviewForm.patchValue({
      status: '',
      approvedAmount: loan.loanAmount,
      interestRate: 10
    });
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.selectedLoan = null;
    this.reviewForm.reset();
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const request = {
      loanId: this.selectedLoan!.id!,
      ...this.reviewForm.value
    };

    this.loanService.reviewLoan(request).subscribe({
      next: () => {
        this.toastr.success('Loan reviewed successfully');
        this.closeReviewModal();
        this.loadPendingLoans();
      },
      error: () => {}
    });
  }

  viewDetails(loanId: number): void {
    this.router.navigate(['/loan-officer/loan-details', loanId]);
  }

  hasError(field: string, error: string): boolean {
    const control = this.reviewForm.get(field);
    return !!(control && control.hasError(error) && (control.dirty || control.touched));
  }
}
