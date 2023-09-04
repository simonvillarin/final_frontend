import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  baseUrl = 'http://localhost:8080/api/farming';

  constructor(private http: HttpClient) {}

  getOfferById = (id: number): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/offers/${id}`);
  };

  getOfferByFarmerId = (id: number): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/offers/farmer/${id}`);
  };

  getOfferBySupplierId = (id: number): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/offers/supplier/${id}`);
  };

  getOfferByPostId = (id: number): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/offers/post/${id}`);
  };

  getOfferByTransactionId = (id: number): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/offers/transaction/${id}`);
  };

  addOffer = (offer: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/offers`, offer);
  };

  updateOffer = (id: number, offer: any): Observable<any> => {
    return this.http.put<any>(`${this.baseUrl}/offers/${id}`, offer);
  };

  deleteOffer = (id: number): Observable<any> => {
    return this.http.delete<any>(`${this.baseUrl}/offers/${id}`);
  };
}
