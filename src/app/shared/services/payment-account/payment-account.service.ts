import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentAccountService {
  baseUrl = 'http://localhost:8080/api/farming';

  constructor(private http: HttpClient) {}

  getAllPaymentAccount = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/payment-accounts`);
  };

  getPaymentAccountById = (id: number): Observable<any> => {
    return this.http.get<any>(`${this.baseUrl}/payment-account/${id}`);
  };

  getPaymentAccountByFarmerId = (id: number): Observable<any> => {
    return this.http.get<any>(`${this.baseUrl}/payment-account/farmer/${id}`);
  };

  addPaymentAccount = (paymentAccount: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/payment-accounts`, paymentAccount);
  };

  updatePaymentAccount = (id: any, paymentAccount: any): Observable<any> => {
    return this.http.put<any>(`${this.baseUrl}/payment-account/${id}`, paymentAccount);
  };
}