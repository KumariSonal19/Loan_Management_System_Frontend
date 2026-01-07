import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/components/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

import { CustomerDashboardComponent } from './features/customer/components/dashboard/dashboard';
import { EmiScheduleComponent } from './features/customer/components/emi-management/emi-schedule/emi-schedule';
import { PaymentComponent } from './features/customer/components/emi-management/payment/payment';

import { AdminDashboardComponent } from './features/admin/components/dashboard/dashboard';
import { LoanTypeListComponent } from './features/admin/components/loan-types/loan-type-list/loan-type-list';
import { UserListComponent } from './features/admin/components/user-management/user-list/user-list';
import { LoanTypeFormComponent } from './features/admin/components/loan-types/loan-type-form/loan-type-form';
import { LoanTypeDetailsComponent } from './features/admin/components/loan-types/loan-type-details/loan-type-details';

import { OfficerDashboardComponent } from './features/loan-officer/components/dashboard/dashboard';
import { PendingLoansComponent } from './features/loan-officer/components/loan-review/pending-loans/pending-loans';
import { LoanHistoryComponent } from './features/loan-officer/components/loan-review/loan-history/loan-history';
import { RegisterComponent } from './features/auth/components/register/register';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ApplyLoanComponent } from './features/customer/components/loan-application/apply-loan/apply-loan';
import { LoanDetailsComponent } from './features/customer/components/loan-application/loan-details/loan-details';
import { AdminLoanListComponent } from './features/admin/components/admin-loan-list/admin-loan-list';
export const routes: Routes = [
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'register',
    component: RegisterComponent
  },

  { path: 'login', component: LoginComponent },

  {
    path: 'customer',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CUSTOMER'] },
    children: [
      { path: 'dashboard', component: CustomerDashboardComponent },
      { path: 'emi-schedule/:id', component: EmiScheduleComponent },
      { path: 'emi-payment/:id', component: PaymentComponent },
      {path: 'apply-loan', component:ApplyLoanComponent},
      {path: 'loans/:id', component:LoanDetailsComponent}
    ]
  },

  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
       { path: 'loan-types', component: LoanTypeListComponent },
      { path: 'loan-types/view/:id', component: LoanTypeDetailsComponent },
      { path: 'loan-types/edit/:id', component: LoanTypeFormComponent },
      { path: 'loan-types/create', component: LoanTypeFormComponent },
      { path: 'users', component: UserListComponent },
      { path: 'loans', component: AdminLoanListComponent }
    ]
  },
  {
  path: 'loan-officer',
  component: MainLayoutComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['LOAN_OFFICER'] },
  children: [
    { path: 'dashboard', component: OfficerDashboardComponent },
    { path: 'pending-loans', component: PendingLoansComponent },
    { path: 'loan-history', component: LoanHistoryComponent }
  ]
},
  { path: '**', redirectTo: 'login' }
];
