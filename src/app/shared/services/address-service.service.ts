import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  serverUrlJson = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  getRegions = (): Observable<any> => {
    return this.http
      .get<any[]>(`${this.serverUrlJson}/region`)
      .pipe(tap((x) => x));
  };
  getProvinces = (): Observable<any> => {
    return this.http
      .get<any[]>(`${this.serverUrlJson}/province`)
      .pipe(tap((x) => x));
  };
  getCities = (): Observable<any> => {
    return this.http
      .get<any[]>(`${this.serverUrlJson}/city`)
      .pipe(tap((x) => x));
  };
  getBarangay = (): Observable<any> => {
    return this.http
      .get<any[]>(`${this.serverUrlJson}/barangay`)
      .pipe(tap((x) => x));
  };
}
