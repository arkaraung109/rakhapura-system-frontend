import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { PaginationOrder } from '../common/PaginationOrder';
import { PaginationResponse } from '../model/PaginationResponse';
import { DataResponse } from '../model/DataResponse';
import { ApiResponse } from '../model/ApiResponse';
import { Punishment } from '../model/Punishment.';

@Injectable({
  providedIn: 'root'
})
export class PunishmentService {

  constructor(private http: HttpClient) { }

  fetchById(id: number): Observable<Punishment> {
    return this.http.get<Punishment>(`${environment.baseUrl}/punishments/${id}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/punishments/segment/search?page=${page}&order=${order}&keyword=${keyword}`, { responseType: "json" });
  }

  save(punishmentDto: Punishment, idList: string[]): Observable<DataResponse> {
    return this.http.post<DataResponse>(`${environment.baseUrl}/punishments?idList=${idList}`, punishmentDto, { responseType: "json" });
  }

  update(punishmentDto: Punishment, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/punishments/${id}`, punishmentDto, { responseType: "json" });
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/punishments/${id}`, { responseType: "json" });
  }

  exportToExcel(keyword: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/punishments/export-to-excel?keyword=${keyword}`, { responseType: "arraybuffer" as "json" });
  }

}
