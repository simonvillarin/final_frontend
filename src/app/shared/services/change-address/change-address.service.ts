import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangeAddressService {
  baseUrl = 'http://localhost:8080/api/farming';

  constructor(private http: HttpClient) {}

  getAllChangeAddress = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/change-address`);
  };

  getChangeAddressById = (id: number): Observable<any> => {
    return this.http.get<any>(`${this.baseUrl}/change-address/${id}`);
  };

  getChangeAddressByTransactionId = (id: number): Observable<any> => {
    return this.http.get<any>(`${this.baseUrl}/change-address/transaction/${id}`);
  };

  addChangeAddress = (changeAddress: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/change-address`, changeAddress);
  };

  updateChangeAddress = (id: any, changeAddress: any): Observable<any> => {
    return this.http.put<any>(`${this.baseUrl}/change-address/${id}`, changeAddress);
  };
}
