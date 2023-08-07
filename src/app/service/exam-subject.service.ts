import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { PaginationResponse } from '../model/PaginationResponse';
import { PaginationOrder } from '../common/PaginationOrder';
import { ApiResponse } from '../model/ApiResponse';
import { ExamSubject } from '../model/ExamSubject';

@Injectable({
  providedIn: 'root'
})
export class ExamSubjectService {

  constructor(private http: HttpClient) { }

  fetchById(id: number): Observable<ExamSubject> {
    return this.http.get<ExamSubject>(`${environment.baseUrl}/exam-subjects/${id}`, { responseType: "json" });
  }

  fetchAllAuthorizedByExam(id: number): Observable<ExamSubject[]> {
    return this.http.get<ExamSubject[]>(`${environment.baseUrl}/exam-subjects/exam/${id}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, academicYearId: number, examTitleId: number, subjectTypeId: number, subjectId: number, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/exam-subjects/segment/search?page=${page}&order=${order}&academicYearId=${academicYearId}&examTitleId=${examTitleId}&subjectTypeId=${subjectTypeId}&subjectId=${subjectId}&keyword=${keyword}`, { responseType: "json" });
  }

  save(examSubjectDto: ExamSubject): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/exam-subjects`, examSubjectDto, { responseType: "json" });
  }

  update(examSubjectDto: ExamSubject, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/exam-subjects/${id}`, examSubjectDto, { responseType: "json" });
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/exam-subjects/${id}`, { responseType: "json" });
  }

  authorize(id: number, authorizedUserId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/exam-subjects/${id}/authorize/${authorizedUserId}`, { responseType: "json" });
  }

}
