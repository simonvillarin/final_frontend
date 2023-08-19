import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login = (user: any) => {
    return this.http.post(`${this.baseUrl}/auth/login`, user);
  };
}
