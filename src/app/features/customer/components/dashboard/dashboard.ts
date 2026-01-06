import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { LoanApplicationService } from '../../services/loan-application';
import { StorageService } from '../../../../core/services/storage';
import { LoanApplication, LoanStatus } from '../../../../shared/models';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class CustomerDashboardComponent implements OnInit {
  isLoading = true;
  loans: LoanApplication[] = [];

  stats = {
    totalLoans: 0,
    appliedLoans: 0,
    approvedLoans: 0,
    rejectedLoans: 0
  };

  readonly LoanStatus = LoanStatus; 

  constructor(
    private loanService: LoanApplicationService,
    private storage: StorageService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomerLoans();
  }

  private loadCustomerLoans(): void {
    const customerId = this.storage.getUserId();
    if (!customerId) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isLoading = true;

    this.loanService.getCustomerLoans(customerId).subscribe({
      next: loans => {
        this.loans = loans;
        this.calculateStats();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private calculateStats(): void {
    this.stats.totalLoans = this.loans.length;

    this.stats.appliedLoans = this.loans.filter(
      l =>
        l.status === LoanStatus.APPLIED ||
        l.status === LoanStatus.UNDER_REVIEW
    ).length;

    this.stats.approvedLoans = this.loans.filter(
      l => l.status === LoanStatus.APPROVED
    ).length;

    this.stats.rejectedLoans = this.loans.filter(
      l => l.status === LoanStatus.REJECTED
    ).length;
  }

  applyForLoan(): void {
    this.router.navigate(['/customer/apply-loan']);
  }

  viewLoanDetails(loanId: number): void {
    this.router.navigate(['/customer/loans', loanId]);
  }

  viewEMISchedule(loanId: number): void {
    this.router.navigate(['/customer/emi-schedule', loanId]);
  }

  getStatusClass(status: LoanStatus): string {
    const statusMap: Record<LoanStatus, string> = {
      [LoanStatus.APPLIED]: 'status-applied',
      [LoanStatus.UNDER_REVIEW]: 'status-review',
      [LoanStatus.APPROVED]: 'status-approved',
      [LoanStatus.REJECTED]: 'status-rejected',
      [LoanStatus.CLOSED]: 'status-closed'
    };

    return statusMap[status];
  }

  getStatusLabel(status: LoanStatus): string {
    return status.replace(/_/g, ' ');
  }
}
