import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationOrder } from '../common/PaginationOrder';
import { PaginationResponse } from '../model/PaginationResponse';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { Student } from '../model/Student';
import { ApiResponse } from '../model/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  fetchById(id: string): Observable<Student> {
    return this.http.get<Student>(`${environment.baseUrl}/students/${id}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, regionId: number, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/students/segment/search?page=${page}&order=${order}&regionId=${regionId}&keyword=${keyword}`, { responseType: "json" });
  }

  save(studentDto: Student): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/students`, studentDto, { responseType: "json" });
  }

  update(studentDto: Student, id: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/students/${id}`, studentDto, { responseType: "json" });
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/students/${id}`, { responseType: "json" });
  }

  exportToExcel(regionId: number, keyword: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/students/export-to-excel?regionId=${regionId}&keyword=${keyword}`, { responseType: "arraybuffer" as "json" });
  }
  
}
