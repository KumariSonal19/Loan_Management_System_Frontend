import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { LoanApplicationService } from '../../../services/loan-application';
import { LoanApplication } from '../../../../../shared/models';

import { LoaderComponent } from '../../../../../shared/components/loader/loader';
import { CurrencyFormatPipe } from '../../../../../shared/pipes/currency-format-pipe';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format-pipe';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoaderComponent,
    CurrencyFormatPipe,
    DateFormatPipe
  ],
  templateUrl: './loan-details.html',
  styleUrls: ['./loan-details.css']
})
export class LoanDetailsComponent implements OnInit {
  loan: LoanApplication | null = null;
  isLoading = true;
  loanId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanApplicationService,
    private toastr: ToastrService, 
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/customer/my-loans']);
      return;
    }

    this.loanId = +id;
    this.loadLoanDetails();
  }

  loadLoanDetails(): void {
    this.loanService.getLoanById(this.loanId).subscribe({
      next: loan => {
        this.loan = loan;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to load loan details');
        this.router.navigate(['/customer/my-loans']);
      }
    });
  }

  viewEMISchedule(): void {
    this.router.navigate(['/customer/emi-schedule', this.loanId]);
  }

  goBack(): void {
    this.router.navigate(['/customer/my-loans']);
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
