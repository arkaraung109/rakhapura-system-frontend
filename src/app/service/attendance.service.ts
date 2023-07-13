import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationOrder } from '../common/PaginationOrder';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../model/PaginationResponse';
import { environment } from 'src/environment/environment';
import { DataResponse } from '../model/DataResponse';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) { }

  fetchPageSegment(page: number, order: PaginationOrder = PaginationOrder.DESC, present: boolean): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/attendances/segment?page=${page}&order=${order}&present=${present}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, present: boolean, academicYearId: number, examTitleId: number, subjectTypeId: number, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/attendances/segment/search?page=${page}&order=${order}&present=${present}&academicYearId=${academicYearId}&examTitleId=${examTitleId}&subjectTypeId=${subjectTypeId}&keyword=${keyword}`, { responseType: "json" });
  }

  save(idList: string[]): Observable<DataResponse> {
    return this.http.post<DataResponse>(`${environment.baseUrl}/attendances?idList=${idList}`, { responseType: "json" });
  }

  exportToExcel(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/attendances/export-to-excel`, { responseType: "arraybuffer" as "json" });
  }
  
}
