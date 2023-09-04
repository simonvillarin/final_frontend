import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  baseUrl = 'http://localhost:8080/api/farming';

  constructor(private http: HttpClient) {}

  getAllPayments = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/payments`);
  };

  getPaymentById = (id: number): Observable<any> => {
    return this.http.get<any>(`${this.baseUrl}/payment/${id}`);
  };

  getPaymentByTransactionId = (id: number): Observable<any> => {
    return this.http.get<any>(`${this.baseUrl}/payment/transaction/${id}`);
  };

  addPayment = (payment: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/payment`, payment);
  };

  updatePayment = (id: any, payment: any): Observable<any> => {
    return this.http.put<any>(`${this.baseUrl}/payment/${id}`, payment);
  };
}
