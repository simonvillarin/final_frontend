import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComplaintsService {
  baseUrl = 'http://localhost:8080/api/farming';

  constructor(private http: HttpClient) {}

  getAllComplaints = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/complaints`);
  };

  addComplaint = (ad: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/complaint`, ad);
  };

  updateComplaint = (id: number, ad: any) => {
    return this.http.put<any>(`${this.baseUrl}/complaint/${id}`, ad);
  };

  getAllComplaintsByFarmerId = (id: number): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/complaint/farmer/${id}`);
  };
}
