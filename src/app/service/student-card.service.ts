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
export class StudentCardService {

  constructor(private http: HttpClient) { }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, examTitleId: number, academicYearId: number, gradeId: number): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/student-cards/segment/search?page=${page}&order=${order}&examTitleId=${examTitleId}&academicYearId=${academicYearId}&gradeId=${gradeId}`, { responseType: "json" });
  }

  save(idList: string[], cardDate: string, examHoldingTimes: number): Observable<DataResponse> {
    return this.http.post<DataResponse>(`${environment.baseUrl}/student-cards?idList=${idList}&cardDate=${cardDate}&examHoldingTimes=${examHoldingTimes}`, { responseType: "json" });
  }

}
