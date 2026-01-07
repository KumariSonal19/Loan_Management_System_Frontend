import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const token = storage.getToken();
  const userId = storage.getUserId();

  let authReq = req;

  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  if (userId) {
    authReq = authReq.clone({
      setHeaders: {
        'X-User-Id': userId.toString()
      }
    });
  }

  return next(authReq);
};
