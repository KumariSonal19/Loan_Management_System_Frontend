import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { LoanApplicationService } from '../../../services/loan-application';
import { StorageService } from '../../../../../core/services/storage';
import { LoanApplication } from '../../../../../shared/models';

import { LoaderComponent } from '../../../../../shared/components/loader/loader';
import { CurrencyFormatPipe } from '../../../../../shared/pipes/currency-format-pipe';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format-pipe';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoaderComponent,
    CurrencyFormatPipe,
    DateFormatPipe
  ],
  templateUrl: './loan-list.html',
  styleUrls: ['./loan-list.css']
})
export class LoanListComponent implements OnInit {
  loans: LoanApplication[] = [];
  filteredLoans: LoanApplication[] = [];
  isLoading = true;
  filterStatus = 'ALL';

  constructor(
    private loanService: LoanApplicationService,
    private storage: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    const customerId = this.storage.getUserId();
    if (!customerId) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isLoading = true;
    this.loanService.getCustomerLoans(customerId).subscribe({
      next: loans => {
        this.loans = loans;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  applyFilter(): void {
    this.filteredLoans =
      this.filterStatus === 'ALL'
        ? this.loans
        : this.loans.filter(l => l.status === this.filterStatus);
  }

  onFilterChange(status: string): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  viewDetails(id: number): void {
    this.router.navigate(['/customer/loans', id]);
  }

  getStatusClass(status: string): string {
    return {
      APPLIED: 'status-applied',
      UNDER_REVIEW: 'status-review',
      APPROVED: 'status-approved',
      REJECTED: 'status-rejected',
      CLOSED: 'status-closed'
    }[status] || '';
  }
}
