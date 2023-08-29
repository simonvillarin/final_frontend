import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  baseUrl = 'http://localhost:8080/api/farming';

  constructor(private http: HttpClient) {}

  getTransactionBySupplierId = (id: number): Observable<any> => {
    return this.http.get(`${this.baseUrl}/transaction/supplier/${id}`);
  };

  getTransactionByFarmerId = (id: number): Observable<any> => {
    return this.http.get(`${this.baseUrl}/transaction/farmer/${id}`);
  };

  addTransaction = (transaction: any): Observable<any> => {
    return this.http.post(`${this.baseUrl}/transaction`, transaction);
  };

  updateTransaction = (id: number, transaction: any): Observable<any> => {
    return this.http.put(`${this.baseUrl}/transaction/${id}`, transaction);
  };

  deleteTransaction = (id: number): Observable<any> => {
    return this.http.delete(`${this.baseUrl}/transaction/${id}`);
  };
}
