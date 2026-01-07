import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../features/admin/services/admin';
import { LoaderComponent } from '../../../../shared/components/loader/loader';

@Component({
  selector: 'app-admin-loan-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe, LoaderComponent],
  templateUrl: './admin-loan-list.html',
  styleUrls: ['./admin-loan-list.css']
})
export class AdminLoanListComponent implements OnInit {
  private adminService = inject(AdminService);
  private cd = inject(ChangeDetectorRef);

  loans: any[] = [];
  filteredLoans: any[] = [];
  isLoading = true;
  searchTerm = '';
  filterStatus = 'ALL';

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.isLoading = true;
    this.adminService.getAllLoans().subscribe({
      next: (data) => {
        this.loans = data;
        this.filteredLoans = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = this.loans;

    if (this.filterStatus !== 'ALL') {
      filtered = filtered.filter(l => l.status === this.filterStatus);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(l =>
        l.id.toString().includes(term)
      );
    }

    this.filteredLoans = filtered;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'badge-success';
      case 'REJECTED': return 'badge-danger';
      case 'UNDER_REVIEW': return 'badge-warning';
      case 'CLOSED': return 'badge-secondary';
      default: return 'badge-info';
    }
  }
}
