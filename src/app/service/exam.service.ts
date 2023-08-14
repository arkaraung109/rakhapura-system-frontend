import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exam } from '../model/Exam';
import { environment } from 'src/environment/environment';
import { PaginationOrder } from '../common/PaginationOrder';
import { PaginationResponse } from '../model/PaginationResponse';
import { ApiResponse } from '../model/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http: HttpClient) { }

  fetchById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${environment.baseUrl}/exams/${id}`, { responseType: "json" });
  }

  fetchAllFilteredByAcademicYearAndExamTitle(academicYearId: number, examTitleId: number): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${environment.baseUrl}/exams/filter?academicYearId=${academicYearId}&examTitleId=${examTitleId}`, { responseType: "json" });
  }

  fetchAllFilteredByAcademicYearAndExamTitleAndGrade(academicYearId: number, examTitleId: number, gradeId: number): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${environment.baseUrl}/exams/filterAll?academicYearId=${academicYearId}&examTitleId=${examTitleId}&gradeId=${gradeId}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, academicYearId: number, examTitleId: number, subjectTypeId: number, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/exams/segment/search?page=${page}&order=${order}&academicYearId=${academicYearId}&examTitleId=${examTitleId}&subjectTypeId=${subjectTypeId}&keyword=${keyword}`, { responseType: "json" });
  }

  save(examDto: Exam): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/exams`, examDto, { responseType: "json" });
  }

  update(examDto: Exam, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/exams/${id}`, examDto, { responseType: "json" });
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/exams/${id}`, { responseType: "json" });
  }

  authorize(id: number, authorizedUserId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/exams/${id}/authorize/${authorizedUserId}`, { responseType: "json" });
  }

}
