import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { LoanTypeService } from '../../../services/loan-type';
import { LoanType } from '../../../../../shared/models';

import { LoaderComponent } from '../../../../../shared/components/loader/loader';
import { CurrencyFormatPipe } from '../../../../../shared/pipes/currency-format-pipe';

@Component({
  selector: 'app-loan-type-details',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    CurrencyFormatPipe
  ],
  templateUrl: './loan-type-details.html',
  styleUrls: ['./loan-type-details.css']
})
export class LoanTypeDetailsComponent implements OnInit {
  loanType: LoanType | null = null;
  isLoading = true;
  loanTypeId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanTypeService: LoanTypeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loanTypeId = +id;
        this.loadLoanType();
      }
    });
  }

  loadLoanType(): void {
    this.isLoading = true;
    this.loanTypeService.getLoanTypeById(this.loanTypeId).subscribe({
      next: (data) => {
        this.loanType = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.router.navigate(['/admin/loan-types']);
      }
    });
  }

  editLoanType(): void {
    this.router.navigate(['/admin/loan-types/edit', this.loanTypeId]);
  }

  goBack(): void {
    this.router.navigate(['/admin/loan-types']);
  }
}
