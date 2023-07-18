import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationOrder } from '../common/PaginationOrder';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../model/PaginationResponse';
import { environment } from 'src/environment/environment';
import { DataResponse } from '../model/DataResponse';
import { Attendance } from '../model/Attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) { }

  fetchByStudentClassId(id: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${environment.baseUrl}/attendances/student-class/${id}`, { responseType: "json" });
  }

  fetchNotPresentPageSegment(page: number, order: PaginationOrder = PaginationOrder.DESC): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/attendances/segment/not-present?page=${page}&order=${order}`, { responseType: "json" });
  }

  fetchNotPresentPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, academicYearId: number, examTitleId: number, subjectTypeId: number, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/attendances/segment/not-present/search?page=${page}&order=${order}&academicYearId=${academicYearId}&examTitleId=${examTitleId}&subjectTypeId=${subjectTypeId}&keyword=${keyword}`, { responseType: "json" });
  }

  fetchPresentPageSegment(page: number, order: PaginationOrder = PaginationOrder.DESC): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/attendances/segment/present?page=${page}&order=${order}`, { responseType: "json" });
  }

  fetchPresentPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, academicYearId: number, examTitleId: number, gradeId: number, studentClass: string, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/attendances/segment/present/search?page=${page}&order=${order}&academicYearId=${academicYearId}&examTitleId=${examTitleId}&gradeId=${gradeId}&studentClass=${studentClass}&keyword=${keyword}`, { responseType: "json" });
  }

  save(idList: string[]): Observable<DataResponse> {
    return this.http.post<DataResponse>(`${environment.baseUrl}/attendances?idList=${idList}`, { responseType: "json" });
  }

  exportToExcel(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/attendances/export-to-excel`, { responseType: "arraybuffer" as "json" });
  }
  
}
