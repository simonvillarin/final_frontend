import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  serverUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  updateUser = (data: any, id: number): Observable<any> => {
    return this.http
      .put<any[]>(`${this.serverUrl}/farming/users/${id}`, data)
      .pipe(tap((x) => x));
  };

  getUser = (id: number): Observable<any> => {
    return this.http
      .get<any[]>(`${this.serverUrl}/farming/users/${id}`)
      .pipe(tap((x) => x));
  };
}
