import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../../../shared/models';
import { AdminService } from '../../../services/admin';
import { LoaderComponent } from '../../../../../shared/components/loader/loader';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = true;
  searchTerm = '';
  filterRole = 'ALL';
  errorMessage = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;

    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load users. Ensure Admin Service is running.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  toggleUserStatus(user: User): void {
    const action = user.active ? 'deactivate' : 'activate';

    if (!confirm(`Are you sure you want to ${action} ${user.username}?`)) {
      return;
    }

    const previousStatus = user.active;
    user.active = !user.active;

    const request$ = previousStatus
      ? this.adminService.deactivateUser(user.userId)
      : this.adminService.activateUser(user.userId);

    request$.subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.userId === updatedUser.userId);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.applyFilters();
          this.cd.detectChanges();
        }
      },
      error: () => {
        alert(`Failed to ${action} user.`);
        user.active = previousStatus;
        this.cd.detectChanges();
      }
    });
  }

  applyFilters(): void {
    let filtered = this.users;

    if (this.filterRole !== 'ALL') {
      filtered = filtered.filter(u => u.role === this.filterRole);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.fullName.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onRoleChange(): void {
    this.applyFilters();
  }
}
