import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentDetailsService {
  baseUrl = 'http://localhost:8080/api/farming';

  constructor(private http: HttpClient) {}

  getAllPaymentDetails = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/payment-details`);
  };

  getPaymentDetailsById = (id: number): Observable<any> => {
    return this.http.get<any>(`${this.baseUrl}/payment-details/${id}`);
  };

  getPaymentDetailsByTransactionId = (id: number): Observable<any> => {
    return this.http.get<any>(`${this.baseUrl}/payment-details/transaction/${id}`);
  };

  addPaymentDetails = (paymentDetails: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/payment-details`, paymentDetails);
  };

  updatePaymentDetails = (id: any, paymentDetails: any): Observable<any> => {
    return this.http.put<any>(`${this.baseUrl}/payment-details/${id}`, paymentDetails);
  };
}