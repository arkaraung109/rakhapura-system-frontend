import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { PublicExamResult } from '../model/PublicExamResult';
import { ApiResponse } from '../model/ApiResponse';
import { PaginationResponse } from '../model/PaginationResponse';

@Injectable({
  providedIn: 'root'
})
export class PublicExamResultService {

  constructor(private http: HttpClient) { }

  fetchPageSegmentBySearching(page: number, academicYearId: number, examTitleId: number, gradeId: number, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/public-exam-results/segment/search?page=${page}&academicYearId=${academicYearId}&examTitleId=${examTitleId}&gradeId=${gradeId}&keyword=${keyword}`, { responseType: "json" });
  }

  publishResult(academicYearId: number, examTitleId: number, gradeId: number, idList: string[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/public-exam-results?academicYearId=${academicYearId}&examTitleId=${examTitleId}&gradeId=${gradeId}&idList=${idList}`, { responseType: "json" });
  }

  exportToExcel(academicYearId: number, examTitleId: number, gradeId: number, keyword: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/public-exam-results/export-to-excel?academicYearId=${academicYearId}&examTitleId=${examTitleId}&gradeId=${gradeId}&keyword=${keyword}`, { responseType: "arraybuffer" as "json" });
  }

}
