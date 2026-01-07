import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { DateFormatPipe } from '../../../../shared/pipes';
import { CurrencyFormatPipe } from '../../../../shared/pipes';
import { LoanApplicationService } from '../../../customer/services/loan-application';
import { LoanApplication, LoanStatus } from '../../../../shared/models';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DateFormatPipe,
    CurrencyFormatPipe
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class OfficerDashboardComponent implements OnInit {
  readonly LoanStatus = LoanStatus;

  isLoading = true;
  pendingLoans: LoanApplication[] = [];
  reviewLoans: LoanApplication[] = [];
  selectedLoan: LoanApplication | null = null;
  showReviewModal = false;
  reviewForm!: FormGroup;

  stats = {
    applied: 0,
    underReview: 0,
    approved: 0,
    rejected: 0
  };

  constructor(
    private loanService: LoanApplicationService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initReviewForm();
    this.loadDashboardData();
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
        this.reviewForm.get('approvedAmount')?.setValidators([Validators.required]);
        this.reviewForm.get('interestRate')?.setValidators([Validators.required]);
      } else {
        this.reviewForm.get('approvedAmount')?.clearValidators();
        this.reviewForm.get('interestRate')?.clearValidators();
      }

      this.reviewForm.get('approvedAmount')?.updateValueAndValidity();
      this.reviewForm.get('interestRate')?.updateValueAndValidity();
    });
  }

  loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      applied: this.loanService.getLoansByStatus(LoanStatus.APPLIED),
      underReview: this.loanService.getLoansByStatus(LoanStatus.UNDER_REVIEW),
      approvedCount: this.loanService.getLoansCountByStatus(LoanStatus.APPROVED),
      rejectedCount: this.loanService.getLoansCountByStatus(LoanStatus.REJECTED)
    }).subscribe({
      next: (results) => {
        this.stats.applied = results.applied.length;
        this.stats.underReview = results.underReview.length;
        this.stats.approved = results.approvedCount.count;
        this.stats.rejected = results.rejectedCount.count;

        this.pendingLoans = [...results.applied, ...results.underReview];
        this.reviewLoans = results.underReview;

        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading dashboard', err);
        this.toastr.error('Failed to load dashboard data');
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

  goToLoanHistory(): void {
    this.router.navigate(['/loan-officer/loan-history']);
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
        this.loadDashboardData();
      },
      error: () => {}
    });
  }
}
