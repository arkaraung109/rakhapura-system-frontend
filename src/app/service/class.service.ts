import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationOrder } from '../common/PaginationOrder';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../model/PaginationResponse';
import { environment } from 'src/environment/environment';
import { ApiResponse } from '../model/ApiResponse';
import { Class } from '../model/Class';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private http: HttpClient) { }

  fetchById(id: number): Observable<Class> {
    return this.http.get<Class>(`${environment.baseUrl}/classes/${id}`, { responseType: "json" });
  }

  fetchDistinctAll(): Observable<String[]> {
    return this.http.get<String[]>(`${environment.baseUrl}/classes/distinct`, { responseType: "json" });
  }

  fetchAllByAuthorizedStatus(): Observable<Class[]> {
    return this.http.get<Class[]>(`${environment.baseUrl}/classes/authorized`, { responseType: "json" });
  }

  fetchAllFilteredByAcademicYearAndGrade(academicYearId: number, gradeId: number): Observable<Class[]> {
    return this.http.get<Class[]>(`${environment.baseUrl}/classes/filter?academicYearId=${academicYearId}&gradeId=${gradeId}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, academicYearId: number, gradeId: number, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/classes/segment/search?page=${page}&order=${order}&academicYearId=${academicYearId}&gradeId=${gradeId}&keyword=${keyword}`, { responseType: "json" });
  }

  save(classDto: Class): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/classes`, classDto, { responseType: "json" });
  }

  update(classDto: Class, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/classes/${id}`, classDto, { responseType: "json" });
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/classes/${id}`, { responseType: "json" });
  }

  authorize(id: number, authorizedUserId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/classes/${id}/authorize/${authorizedUserId}`, { responseType: "json" });
  }
  
}
