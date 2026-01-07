import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../shared/models'; 

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const requiredRoles = route.data['roles'] as User['role'][]; 
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (authService.hasRole(requiredRoles)) {
    return true;
  }

  toastr.warning('You do not have permission to access this page', 'Access Denied');
  router.navigate(['/']);
  return false;
};