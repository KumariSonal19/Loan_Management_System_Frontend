import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { LoanTypeService } from '../../../services/loan-type';
import { LoanType } from '../../../../../shared/models';

@Component({
  selector: 'app-loan-type-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    RouterModule
  ],
  templateUrl: './loan-type-list.html',
  styleUrls: ['./loan-type-list.css']
})
export class LoanTypeListComponent implements OnInit {
  loanTypes: LoanType[] = [];
  filteredLoanTypes: LoanType[] = [];
  isLoading = true;
  searchTerm = '';
  showInactive = false;

  constructor(
    private loanTypeService: LoanTypeService,
    private router: Router,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLoanTypes();
  }

  loadLoanTypes(): void {
    this.isLoading = true;

    this.loanTypeService.getAllLoanTypes().subscribe({
      next: data => {
        this.loanTypes = data;
        this.applyFilters();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.loanTypes];

    if (!this.showInactive) {
      filtered = filtered.filter(lt => lt.isActive);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        lt =>
          lt.typeName.toLowerCase().includes(term) ||
          lt.description?.toLowerCase().includes(term)
      );
    }

    this.filteredLoanTypes = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onShowInactiveChange(): void {
    this.applyFilters();
  }

  createLoanType(): void {
    this.router.navigate(['/admin/loan-types/create']);
  }

  editLoanType(id: number): void {
    this.router.navigate(['/admin/loan-types/edit', id]);
  }

  viewLoanType(id: number): void {
    this.router.navigate(['/admin/loan-types/view', id]);
  }

  toggleStatus(loanType: LoanType): void {
    const action = loanType.isActive ? 'deactivate' : 'activate';

    if (!confirm(`Are you sure you want to ${action} "${loanType.typeName}"?`)) {
      return;
    }

    const request$ = loanType.isActive
      ? this.loanTypeService.deactivateLoanType(loanType.id!)
      : this.loanTypeService.activateLoanType(loanType.id!);

    request$.subscribe({
      next: () => {
        this.toastr.success(`Loan type ${action}d successfully`);
        this.loadLoanTypes();
      }
    });
  }

  deleteLoanType(loanType: LoanType): void {
    if (
      !confirm(
        `Are you sure you want to delete "${loanType.typeName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    this.loanTypeService.deleteLoanType(loanType.id!).subscribe({
      next: () => {
        this.toastr.success('Loan type deleted successfully');
        this.loadLoanTypes();
      }
    });
  }
}
