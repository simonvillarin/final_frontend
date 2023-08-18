import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  serverUrl = 'http://localhost:8080/api/auth/register';

  constructor(private http: HttpClient) {}

  registerUser = (data: any): Observable<any> => {
    return this.http.post<any[]>(`${this.serverUrl}`, data).pipe(tap((x) => x));
  };
}
