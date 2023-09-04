import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  baseUrl = 'http://localhost:8080/api/farming';

  constructor(private http: HttpClient) {}

  getAllCourses = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.baseUrl}/courses`);
  };

  addCourse = (course: any): Observable<any> => {
    return this.http.post<any>(`${this.baseUrl}/courses`, course);
  };

  updateCourse = (id: number, course: any): Observable<any> => {
    return this.http.put<any>(`${this.baseUrl}/course/${id}`, course);
  };
}
