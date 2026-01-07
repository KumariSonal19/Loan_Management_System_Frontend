import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { LoanApplicationService } from '../../../../customer/services/loan-application';
import { LoanApplication, LoanStatus } from '../../../../../shared/models';

import { LoaderComponent } from '../../../../../shared/components/loader/loader';
import { CurrencyFormatPipe } from '../../../../../shared/pipes/currency-format-pipe';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format-pipe';

@Component({
  selector: 'app-loan-history',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    CurrencyFormatPipe,
    DateFormatPipe
  ],
  templateUrl: './loan-history.html',
  styleUrls: ['./loan-history.css']
})
export class LoanHistoryComponent implements OnInit {
  readonly LoanStatus = LoanStatus;

  reviewedLoans: LoanApplication[] = [];
  filteredLoans: LoanApplication[] = [];
  isLoading = true;
  filterStatus = 'ALL';

  constructor(
    private loanService: LoanApplicationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReviewedLoans();
  }

  loadReviewedLoans(): void {
    this.isLoading = true;

    forkJoin({
      approved: this.loanService.getLoansByStatus(LoanStatus.APPROVED),
      rejected: this.loanService.getLoansByStatus(LoanStatus.REJECTED)
    }).subscribe({
      next: (result) => {
        this.reviewedLoans = [...result.approved, ...result.rejected].sort((a, b) => {
          const dateA = new Date(a.approvalDate || 0).getTime();
          const dateB = new Date(b.approvalDate || 0).getTime();
          return dateB - dateA;
        });

        this.applyFilter();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.filterStatus === 'ALL') {
      this.filteredLoans = this.reviewedLoans;
    } else {
      this.filteredLoans = this.reviewedLoans.filter(
        loan => loan.status === this.filterStatus
      );
    }
  }

  onFilterChange(status: string): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      [LoanStatus.APPROVED]: 'status-approved',
      [LoanStatus.REJECTED]: 'status-rejected'
    };
    return statusMap[status] || '';
  }
}
