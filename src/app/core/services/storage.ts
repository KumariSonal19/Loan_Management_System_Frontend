import { Injectable } from '@angular/core';
import { User } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor() {}

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? (JSON.parse(user) as User) : null;
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  clearStorage(): void {
    localStorage.clear();
  }

  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  getUserId(): number | null {
    return this.getUser()?.userId ?? null;
  }
}
