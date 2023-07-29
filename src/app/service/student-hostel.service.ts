import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { PaginationOrder } from '../common/PaginationOrder';
import { PaginationResponse } from '../model/PaginationResponse';
import { DataResponse } from '../model/DataResponse';
import { StudentClass } from '../model/StudentClass';
import { ApiResponse } from '../model/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class StudentHostelService {

  constructor(private http: HttpClient) { }  

  fetchNotPresentPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, examTitleId: number, academicYearId: number, gradeId: number, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/student-hostels/segment/not-present/search?page=${page}&order=${order}&examTitleId=${examTitleId}&academicYearId=${academicYearId}&gradeId=${gradeId}&keyword=${keyword}`, { responseType: "json" });
  }

  fetchPresentPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, examTitleId: number, academicYearId: number, gradeId: number, hostelId: number, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/student-hostels/segment/present/search?page=${page}&order=${order}&examTitleId=${examTitleId}&academicYearId=${academicYearId}&gradeId=${gradeId}&hostelId=${hostelId}&keyword=${keyword}`, { responseType: "json" });
  }

  save(studentClassDto: StudentClass, idList: string[]): Observable<DataResponse> {
    return this.http.post<DataResponse>(`${environment.baseUrl}/student-hostels?idList=${idList}`, studentClassDto, { responseType: "json" });
  }

  update(studentClassDto: StudentClass, id: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/student-hostels/${id}`, studentClassDto, { responseType: "json" });
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/student-hostels/${id}`, { responseType: "json" });
  }

  exportToExcel(examTitleId: number, academicYearId: number, gradeId: number, hostelId: number, keyword: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/student-hostels/export-to-excel?examTitleId=${examTitleId}&academicYearId=${academicYearId}&gradeId=${gradeId}&hostelId=${hostelId}&keyword=${keyword}`, { responseType: "arraybuffer" as "json" });
  }

}
