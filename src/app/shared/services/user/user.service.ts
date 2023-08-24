import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'http://localhost:8080/api/farming';

  constructor(private http: HttpClient) {}

  getUserById = (id: number): Observable<any> => {
    return this.http.get<any>(`${this.baseUrl}/user/${id}`);
  };

  updateUser = (id: number, user: any): Observable<any> => {
    return this.http.put<any>(`${this.baseUrl}/user/${id}`, user);
  };

  getAllFarmers = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/farmers`);
  };

  getAllSupplier = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/suppliers`);
  };
}
