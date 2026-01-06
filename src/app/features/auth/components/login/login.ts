import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule
  ], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    
    this.initForm();

    if (this.authService.isAuthenticated()) {
      this.redirectToDashboard();
    }
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.toastr.success(
          `Welcome back, ${response.fullName}!`,
          'Login Successful'
        );
        this.redirectToDashboard();
      },
      error: () => {
        this.isLoading = false;
        this.loginForm.get('password')?.reset();
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private redirectToDashboard(): void {
    const role = this.authService.getUserRole();

    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'LOAN_OFFICER':
        this.router.navigate(['/loan-officer/dashboard']);
        break;
      case 'CUSTOMER':
        this.router.navigate(['/customer/dashboard']);
        break;
      default:
        this.router.navigate(['/']); 
    }
  }

  hasError(field: string, error: string): boolean {
    const control = this.loginForm.get(field);
    return !!(
      control &&
      control.hasError(error) &&
      (control.dirty || control.touched)
    );
  }
}