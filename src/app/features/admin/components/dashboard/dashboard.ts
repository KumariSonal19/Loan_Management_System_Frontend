import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { LoanApplicationService } from '../../../customer/services/loan-application';
import { EMIService } from '../../../customer/services/emi';
import { LoanStatus } from '../../../../shared/models';

interface AdminDashboardStats {
  totalLoans: number;
  appliedLoans: number;
  underReviewLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
  totalOutstanding: number;
  totalOverdue: number;
  overdueCount: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  isLoading = true;

  stats: AdminDashboardStats = {
    totalLoans: 0,
    appliedLoans: 0,
    underReviewLoans: 0,
    approvedLoans: 0,
    rejectedLoans: 0,
    totalOutstanding: 0,
    totalOverdue: 0,
    overdueCount: 0
  };

  constructor(
    private loanService: LoanApplicationService,
    private emiService: EMIService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      totalLoans: this.loanService.getTotalLoansCount(),
      appliedCount: this.loanService.getLoansCountByStatus(LoanStatus.APPLIED),
      reviewCount: this.loanService.getLoansCountByStatus(LoanStatus.UNDER_REVIEW),
      approvedCount: this.loanService.getLoansCountByStatus(LoanStatus.APPROVED),
      rejectedCount: this.loanService.getLoansCountByStatus(LoanStatus.REJECTED),
      totalOutstanding: this.emiService.getTotalOutstanding(),
      totalOverdue: this.emiService.getTotalOverdue(),
      overdueCount: this.emiService.getOverdueCount()
    }).subscribe({
      next: response => {
        this.stats = {
          totalLoans: response.totalLoans,
          appliedLoans: response.appliedCount.count,
          underReviewLoans: response.reviewCount.count,
          approvedLoans: response.approvedCount.count,
          rejectedLoans: response.rejectedCount.count,
          totalOutstanding: response.totalOutstanding,
          totalOverdue: response.totalOverdue,
          overdueCount: response.overdueCount
        };
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
