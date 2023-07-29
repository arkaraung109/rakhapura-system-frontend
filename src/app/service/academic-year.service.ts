import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { PaginationOrder } from '../common/PaginationOrder';
import { AcademicYear } from '../model/AcademicYear';
import { ApiResponse } from '../model/ApiResponse';
import { PaginationResponse } from '../model/PaginationResponse';

@Injectable({
  providedIn: 'root'
})
export class AcademicYearService {

  constructor(private http: HttpClient) { }

  fetchById(id: number): Observable<AcademicYear> {
    return this.http.get<AcademicYear>(`${environment.baseUrl}/academic-years/${id}`, { responseType: "json" });
  }

  fetchAllByAuthorizedStatus(): Observable<AcademicYear[]> {
    return this.http.get<AcademicYear[]>(`${environment.baseUrl}/academic-years/authorized`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/academic-years/segment/search?page=${page}&order=${order}&keyword=${keyword}`, { responseType: "json" });
  }

  save(academicYearDto: AcademicYear): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/academic-years`, academicYearDto, { responseType: "json" });
  }

  update(academicYearDto: AcademicYear, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/academic-years/${id}`, academicYearDto, { responseType: "json" });
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/academic-years/${id}`, { responseType: "json" });
  }

  authorize(id: number, authorizedUserId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/academic-years/${id}/authorize/${authorizedUserId}`, { responseType: "json" });
  }
  
}
