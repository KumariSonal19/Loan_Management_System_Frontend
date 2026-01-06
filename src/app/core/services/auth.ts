import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router, RouterLink, RouterModule } from '@angular/router';

import { environment } from '../../../environments/environment';
import { StorageService } from './storage';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User
} from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  private readonly AUTH_URL =
    `${environment.apiUrl}${environment.endpoints.auth}`;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) {
    this.loadCurrentUser();
  }


  private loadCurrentUser(): void {
    const user = this.storage.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  register(data: RegisterRequest): Observable<string> {
  return this.http.post(
    `${this.AUTH_URL}/register`,
    data,
    { responseType: 'text' } 
  );
}



  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.AUTH_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.storage.saveToken(response.accessToken);

          const user: User = {
            userId: response.userId,
            username: response.username,
            email: response.email,
            fullName: response.fullName,
            role: response.role as User['role']
          };

          this.storage.saveUser(user);
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    this.storage.clearStorage();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.storage.isLoggedIn();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): User['role'] | null {
    
    return this.storage.getUserRole() as User['role'];
  }

  hasRole(roles: User['role'][]): boolean {
    const role = this.getUserRole();
    return role ? roles.includes(role) : false;
  }

  getUserProfile(userId: number): Observable<User> {
    return this.http.get<User>(
      `${this.AUTH_URL}/profile/${userId}`
    );
  }

  updateProfile(
    userId: number,
    data: Partial<RegisterRequest>
  ): Observable<User> {
    return this.http.put<User>(
      `${this.AUTH_URL}/profile/${userId}`,
      data
    );
  }

 

}
