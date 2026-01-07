import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoanType } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class LoanTypeService {
  private readonly API_URL =
    `${environment.apiUrl}${environment.endpoints.admin}/loan-types`;

  constructor(private http: HttpClient) {}

  getAllActiveLoanTypes(): Observable<LoanType[]> {
    return this.http.get<LoanType[]>(this.API_URL);
  }

  getAllLoanTypes(): Observable<LoanType[]> {
    return this.http.get<LoanType[]>(`${this.API_URL}/all`);
  }

  getLoanTypeById(id: number): Observable<LoanType> {
    return this.http.get<LoanType>(`${this.API_URL}/${id}`);
  }

  createLoanType(data: LoanType): Observable<LoanType> {
    return this.http.post<LoanType>(this.API_URL, data);
  }

  updateLoanType(id: number, data: LoanType): Observable<LoanType> {
    return this.http.put<LoanType>(`${this.API_URL}/${id}`, data);
  }

  activateLoanType(id: number): Observable<LoanType> {
    return this.http.put<LoanType>(`${this.API_URL}/${id}/activate`, {});
  }

  deactivateLoanType(id: number): Observable<LoanType> {
    return this.http.put<LoanType>(`${this.API_URL}/${id}/deactivate`, {});
  }

  deleteLoanType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
