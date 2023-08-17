import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationOrder } from '../common/PaginationOrder';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../model/PaginationResponse';
import { environment } from 'src/environment/environment';
import { DataResponse } from '../model/DataResponse';
import { Attendance } from '../model/Attendance';
import { CustomPaginationResponse } from '../model/CustomPaginationResponse';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) { }

  fetchByPresentStudentClass(id: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${environment.baseUrl}/attendances/student-class/present/${id}`, { responseType: "json" });
  }

  fetchNotPresentPageSegmentBySearching(page: number, academicYearId: number, examTitleId: number, subjectTypeId: number, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/attendances/segment/not-present/search?page=${page}&academicYearId=${academicYearId}&examTitleId=${examTitleId}&subjectTypeId=${subjectTypeId}&keyword=${keyword}`, { responseType: "json" });
  }

  fetchPresentPageSegmentBySearching(page: number, academicYearId: number, examTitleId: number, gradeId: number, keyword: string): Observable<CustomPaginationResponse> {
    return this.http.get<CustomPaginationResponse>(`${environment.baseUrl}/attendances/segment/present/search?page=${page}&academicYearId=${academicYearId}&examTitleId=${examTitleId}&gradeId=${gradeId}&keyword=${keyword}`, { responseType: "json" });
  }

  save(idList: string[]): Observable<DataResponse> {
    return this.http.post<DataResponse>(`${environment.baseUrl}/attendances?idList=${idList}`, { responseType: "json" });
  }

  exportToExcel(academicYearId: number, examTitleId: number, gradeId: number, keyword: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/attendances/export-to-excel?academicYearId=${academicYearId}&examTitleId=${examTitleId}&gradeId=${gradeId}&keyword=${keyword}`, { responseType: "arraybuffer" as "json" });
  }
  
}
