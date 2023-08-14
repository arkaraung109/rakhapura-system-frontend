import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Award } from '../model/Award';
import { environment } from 'src/environment/environment';
import { PaginationOrder } from '../common/PaginationOrder';
import { PaginationResponse } from '../model/PaginationResponse';
import { DataResponse } from '../model/DataResponse';
import { ApiResponse } from '../model/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class AwardService {

  constructor(private http: HttpClient) { }

  fetchById(id: number): Observable<Award> {
    return this.http.get<Award>(`${environment.baseUrl}/awards/${id}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/awards/segment/search?page=${page}&order=${order}&keyword=${keyword}`, { responseType: "json" });
  }

  save(awardDto: Award, idList: string[]): Observable<DataResponse> {
    return this.http.post<DataResponse>(`${environment.baseUrl}/awards?idList=${idList}`, awardDto, { responseType: "json" });
  }

  update(awardDto: Award, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/awards/${id}`, awardDto, { responseType: "json" });
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/awards/${id}`, { responseType: "json" });
  }

  exportToExcel(keyword: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/awards/export-to-excel?keyword=${keyword}`, { responseType: "arraybuffer" as "json" });
  }

}
