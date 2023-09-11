import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  baseUrl = 'http://localhost:8080/api/farming/email';

  constructor(private http: HttpClient) {}

  sendEmail = (email: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/send`, email);
  };

  checkEmail = (email: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/check`, email);
  };

  isOTPExpired = (): Observable<any> => {
    return this.http.get<any>(`${this.baseUrl}/expired`);
  };

  isOTP = (email: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/otp`, email);
  };

  getUserId = (): Observable<any> => {
    return this.http.get<any>(`${this.baseUrl}/userId`);
  };

  updateUser = (id: number, user: any): Observable<any> => {
    return this.http.put<any>(`${this.baseUrl}/user/${id}`, user);
  };

  sendEmail1 = (email: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/message`, email);
  };
}
