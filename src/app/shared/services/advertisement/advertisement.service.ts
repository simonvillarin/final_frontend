import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdvertisementService {
  baseUrl = 'http://localhost:8080/api/farming';

  constructor(private http: HttpClient) {}

  getAdById = (id: number): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/ad/${id}`);
  };

  getAllAdvertisement = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/advertisements`);
  };

  getAdBySupplierId = (id: number): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/ad/supplier/${id}`);
  };

  addAdvertisement = (ad: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/ad`, ad);
  };

  updateAdvertisement = (id: number, ad: any) => {
    return this.http.put<any>(`${this.baseUrl}/ad/${id}`, ad);
  };
}
