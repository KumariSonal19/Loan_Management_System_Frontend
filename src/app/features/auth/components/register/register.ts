import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
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
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
  username: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
  password: [
    '',
    [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{8,}$/
      )
    ]
  ],
  fullName: ['', Validators.required],
  phoneNumber: [
    '',
    [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
  ]
});

  }

  onSubmit(): void {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;

  const payload = {
    ...this.registerForm.value,
    role: 'CUSTOMER'
  };

  this.authService.register(payload).subscribe({
    next: () => {
      this.toastr.success(
        'Registration successful! Please login.',
        'Success'
      );
      this.router.navigate(['/auth/login']);
    },
    error: (err) => {
      this.isLoading = false;

      const message =
        err?.error?.message ||
        'Registration failed. Please try again.';

      this.toastr.error(message, 'Registration Failed');
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}

  hasError(field: string, error: string): boolean {
    const control = this.registerForm.get(field);
    return !!(
      control &&
      control.hasError(error) &&
      (control.dirty || control.touched)
    );
  }

  getPasswordErrors(): string {
    const control = this.registerForm.get('password');
    if (!control || !control.touched) return '';

    if (control.hasError('required')) return 'Password is required';
    if (control.hasError('minlength'))
      return 'Password must be at least 8 characters';
    if (control.hasError('pattern'))
      return 'Password must contain uppercase, lowercase, number and special character';

    return '';
  }
}
