import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models'; 

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  
  private baseUrl = 'http://localhost:8087/api/admin'; 

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  activateUser(userId: number): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${userId}/activate`, {});
  }
  deactivateUser(userId: number): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${userId}/deactivate`, {});
  }
getAllLoans(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/loans`);
}
}