import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationResponse } from '../model/PaginationResponse';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/ApiResponse';
import { PaginationOrder } from '../common/PaginationOrder';
import { Grade } from '../model/Grade';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  constructor(private http: HttpClient) { }

  fetchById(id: number): Observable<Grade> {
    return this.http.get<Grade>(`${environment.baseUrl}/grades/${id}`, { responseType: "json" });
  }

  fetchAllByAuthorizedStatus(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${environment.baseUrl}/grades/authorized`, { responseType: "json" });
  } 

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/grades/segment/search?page=${page}&order=${order}&keyword=${keyword}`, { responseType: "json" });
  }

  save(gradeDto: Grade): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/grades`, gradeDto, { responseType: "json" });
  }

  update(gradeDto: Grade, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/grades/${id}`, gradeDto, { responseType: "json" });
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/grades/${id}`, { responseType: "json" });
  }

  authorize(id: number, authorizedUserId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/grades/${id}/authorize/${authorizedUserId}`, { responseType: "json" });
  }
  
}
