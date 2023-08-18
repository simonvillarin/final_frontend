import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getBarangay = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/barangay`);
  };

  getCity = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/city`);
  };

  getProvince = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/province`);
  };

  getRegion = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/region`);
  };
}
