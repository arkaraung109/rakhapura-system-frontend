import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/ApiResponse';
import { environment } from 'src/environment/environment';
import { PaginationOrder } from '../common/PaginationOrder';
import { PaginationResponse } from '../model/PaginationResponse';

@Injectable({
  providedIn: 'root'
})
export class ArrivalService {

  constructor(private http: HttpClient) { }

  fetchPageSegment(page: number, order: PaginationOrder = PaginationOrder.DESC): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/arrivals/segment?page=${page}&order=${order}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, examTitleId: number, academicYearId: number, gradeId: number, studentClass: string, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/arrivals/segment/search?page=${page}&order=${order}&examTitleId=${examTitleId}&academicYearId=${academicYearId}&gradeId=${gradeId}&studentClass=${studentClass}&keyword=${keyword}`, { responseType: "json" });
  }

  update(id: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/arrivals/${id}`, { responseType: "json" });
  }

  exportToExcel(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/arrivals/export-to-excel`, { responseType: "arraybuffer" as "json" });
  }
  
}
