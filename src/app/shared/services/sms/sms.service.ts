import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  baseUrl = 'http://localhost:8080/api/farming';

  constructor(private http: HttpClient) {}

  sendAdminSMS = (sms: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/sms/admin`, sms);
  };

  sendFarmerSMS = (sms: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/sms/farmer`, sms);
  };

  sendSupplierSMS = (sms: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/sms/supplier`, sms);
  };
}
