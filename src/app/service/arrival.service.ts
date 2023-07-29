import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { PaginationOrder } from '../common/PaginationOrder';
import { PaginationResponse } from '../model/PaginationResponse';
import { DataResponse } from '../model/DataResponse';

@Injectable({
  providedIn: 'root'
})
export class ArrivalService {

  constructor(private http: HttpClient) { }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, arrival: boolean, examTitleId: number, academicYearId: number, gradeId: number, studentClass: string, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/arrivals/segment/search?page=${page}&order=${order}&arrival=${arrival}&examTitleId=${examTitleId}&academicYearId=${academicYearId}&gradeId=${gradeId}&studentClass=${studentClass}&keyword=${keyword}`, { responseType: "json" });
  }

  save(idList: string[]): Observable<DataResponse> {
    return this.http.post<DataResponse>(`${environment.baseUrl}/arrivals?idList=${idList}`, { responseType: "json" });
  }

  exportToExcel(examTitleId: number, academicYearId: number, gradeId: number, studentClass: string, keyword: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/arrivals/export-to-excel?examTitleId=${examTitleId}&academicYearId=${academicYearId}&gradeId=${gradeId}&studentClass=${studentClass}&keyword=${keyword}`, { responseType: "arraybuffer" as "json" });
  }
  
}
