import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError(error => {
      if (req.url.includes('/auth')) {
        return throwError(() => error);
      }

      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Invalid request';
            break;

          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            localStorage.clear();
            router.navigate(['/auth/login']);
            break;

          case 403:
            errorMessage = 'Access denied. Insufficient permissions.';
            break;

          case 404:
            errorMessage = error.error?.message || 'Resource not found';
            break;

          case 500:
            errorMessage = error.error?.message || 'Internal server error';
            break;

          default:
            errorMessage =
              error.error?.message ||
              error.message ||
              'Unknown error occurred';
        }
      }

      toastr.error(errorMessage, 'Error');
      return throwError(() => error);
    })
  );
};
