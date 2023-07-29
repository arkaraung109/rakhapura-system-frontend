import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationOrder } from '../common/PaginationOrder';
import { PaginationResponse } from '../model/PaginationResponse';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/ApiResponse';
import { Region } from '../model/Region';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(private http: HttpClient) { }

  fetchById(id: number): Observable<Region> {
    return this.http.get<Region>(`${environment.baseUrl}/regions/${id}`, { responseType: "json" });
  }

  fetchAllByAuthorizedStatus(): Observable<Region[]> {
    return this.http.get<Region[]>(`${environment.baseUrl}/regions/authorized`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/regions/segment/search?page=${page}&order=${order}&keyword=${keyword}`, { responseType: "json" });
  }

  save(regionDto: Region): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/regions`, regionDto, { responseType: "json" });
  }

  update(regionDto: Region, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/regions/${id}`, regionDto, { responseType: "json" });
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/regions/${id}`, { responseType: "json" });
  }

  authorize(id: number, authorizedUserId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/regions/${id}/authorize/${authorizedUserId}`, { responseType: "json" });
  }
  
}
