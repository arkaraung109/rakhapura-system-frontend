import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubjectType } from '../model/SubjectType';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { PaginationOrder } from '../common/PaginationOrder';
import { PaginationResponse } from '../model/PaginationResponse';
import { ApiResponse } from '../model/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class SubjectTypeService {

  constructor(private http: HttpClient) { }

  fetchById(id: number): Observable<SubjectType> {
    return this.http.get<SubjectType>(`${environment.baseUrl}/subject-types/${id}`, { responseType: "json" });
  }

  fetchAllByAuthorizedStatus(): Observable<SubjectType[]> {
    return this.http.get<SubjectType[]>(`${environment.baseUrl}/subject-types/authorized`, { responseType: "json" });
  }

  fetchAllFilteredByGrade(gradeId: number): Observable<SubjectType[]> {
    return this.http.get<SubjectType[]>(`${environment.baseUrl}/subject-types/filter?gradeId=${gradeId}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, gradeId: number, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/subject-types/segment/search?page=${page}&order=${order}&gradeId=${gradeId}&keyword=${keyword}`, { responseType: "json" });
  }

  save(subjectTypeDto: SubjectType): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/subject-types`, subjectTypeDto, { responseType: "json" });
  }

  update(subjectTypeDto: SubjectType, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/subject-types/${id}`, subjectTypeDto, { responseType: "json" });
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/subject-types/${id}`, { responseType: "json" });
  }

  authorize(id: number, authorizedUserId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/subject-types/${id}/authorize/${authorizedUserId}`, { responseType: "json" });
  }
  
}
