import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationOrder } from '../common/PaginationOrder';
import { PaginationResponse } from '../model/PaginationResponse';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ExamTitle } from '../model/ExamTitle';
import { ApiResponse } from '../model/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ExamTitleService {

  constructor(private http: HttpClient) { }

  fetchById(id: number): Observable<ExamTitle> {
    return this.http.get<ExamTitle>(`${environment.baseUrl}/exam-titles/${id}`, { responseType: "json" });
  }

  fetchAllByAuthorizedStatus(): Observable<ExamTitle[]> {
    return this.http.get<ExamTitle[]>(`${environment.baseUrl}/exam-titles/authorized`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/exam-titles/segment/search?page=${page}&order=${order}&keyword=${keyword}`, { responseType: "json" });
  }

  save(examTitleDto: ExamTitle): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/exam-titles`, examTitleDto, { responseType: "json" });
  }

  update(examTitleDto: ExamTitle, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/exam-titles/${id}`, examTitleDto, { responseType: "json" });
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/exam-titles/${id}`, { responseType: "json" });
  }

  authorize(id: number, authorizedUserId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/exam-titles/${id}/authorize/${authorizedUserId}`, { responseType: "json" });
  }
  
}
