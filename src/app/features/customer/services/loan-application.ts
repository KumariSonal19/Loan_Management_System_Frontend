import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  LoanApplication,
  LoanApprovalRequest,
  LoanStatus
} from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class LoanApplicationService {
  private readonly API_URL =
    `${environment.apiUrl}${environment.endpoints.loans}`;

  constructor(private http: HttpClient) {}

  applyLoan(data: LoanApplication): Observable<{ loanId: number }> {
    return this.http.post<{ loanId: number }>(
      `${this.API_URL}/apply`,
      data
    );
  }

  getLoanById(id: number): Observable<LoanApplication> {
    return this.http.get<LoanApplication>(`${this.API_URL}/${id}`);
  }

  getCustomerLoans(customerId: number): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(
      `${this.API_URL}/customer/list/${customerId}`
    );
  }

  getLoansByStatus(status: LoanStatus): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(
      `${this.API_URL}/status/${status}`
    );
  }

  reviewLoan(
    request: LoanApprovalRequest
  ): Observable<LoanApplication> {
    return this.http.put<LoanApplication>(
      `${this.API_URL}/review`,
      request
    );
  }

  getLoansCountByStatus(
    status: LoanStatus
  ): Observable<{ status: LoanStatus; count: number }> {
    return this.http.get<{ status: LoanStatus; count: number }>(
      `${this.API_URL}/count/${status}`
    );
  }

  getTotalLoansCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total`);
  }
}
