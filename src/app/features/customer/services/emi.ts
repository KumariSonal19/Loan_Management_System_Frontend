import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EMISchedule, PaymentRequest } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class EMIService {
  private readonly API_URL =
    `${environment.apiUrl}${environment.endpoints.emis}`;

  constructor(private http: HttpClient) {}

  getEMISchedule(loanId: number): Observable<EMISchedule[]> {
    return this.http.get<EMISchedule[]>(
      `${this.API_URL}/schedule/${loanId}`
    );
  }

  makePayment(request: PaymentRequest): Observable<void> {
    return this.http.post<void>(
      `${this.API_URL}/repay`,
      request
    );
  }

  getOutstandingBalance(loanId: number): Observable<number> {
    return this.http.get<number>(
      `${this.API_URL}/outstanding/${loanId}`
    );
  }

  getOverdueEMIs(): Observable<EMISchedule[]> {
    return this.http.get<EMISchedule[]>(
      `${this.API_URL}/overdue`
    );
  }

  getTotalOutstanding(): Observable<number> {
    return this.http.get<number>(
      `${this.API_URL}/total-outstanding`
    );
  }

  getTotalOverdue(): Observable<number> {
    return this.http.get<number>(
      `${this.API_URL}/total-overdue`
    );
  }

  getOverdueCount(): Observable<number> {
    return this.http.get<number>(
      `${this.API_URL}/overdue-count`
    );
  }

  getTotalDisbursed(): Observable<number> {
    return this.http.get<number>(
      `${this.API_URL}/total-disbursed`
    );
  }
}
