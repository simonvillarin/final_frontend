import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FarmingTipsService {
  baseUrl = 'http://localhost:8080/api/farming';

  constructor(private http: HttpClient) {}

  getAllFarmingTips = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/tips`);
  };

  addTip = (ad: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/tip`, ad);
  };

  updateTip = (id: number, ad: any) => {
    return this.http.put<any>(`${this.baseUrl}/tip/${id}`, ad);
  };
}
