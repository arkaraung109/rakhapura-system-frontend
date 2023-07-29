import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Subject } from '../model/Subject';
import { PaginationOrder } from '../common/PaginationOrder';
import { PaginationResponse } from '../model/PaginationResponse';
import { ApiResponse } from '../model/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient) { }

  fetchById(id: number): Observable<Subject> {
    return this.http.get<Subject>(`${environment.baseUrl}/subjects/${id}`, { responseType: "json" });
  }

  fetchAllByAuthorizedStatus(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${environment.baseUrl}/subjects/authorized`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/subjects/segment/search?page=${page}&order=${order}&keyword=${keyword}`, { responseType: "json" });
  }

  save(subjectDto: Subject): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/subjects`, subjectDto, { responseType: "json" });
  }

  update(subjectDto: Subject, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/subjects/${id}`, subjectDto, { responseType: "json" });
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/subjects/${id}`, { responseType: "json" });
  }

  authorize(id: number, authorizedUserId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/subjects/${id}/authorize/${authorizedUserId}`, { responseType: "json" });
  }
  
}
