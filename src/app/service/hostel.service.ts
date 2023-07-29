import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationOrder } from '../common/PaginationOrder';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../model/PaginationResponse';
import { environment } from 'src/environment/environment';
import { Hostel } from '../model/Hostel';
import { ApiResponse } from '../model/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class HostelService {

  constructor(private http: HttpClient) { }

  fetchById(id: number): Observable<Hostel> {
    return this.http.get<Hostel>(`${environment.baseUrl}/hostels/${id}`, { responseType: "json" });
  }

  fetchAllByAuthorizedStatus(): Observable<Hostel[]> {
    return this.http.get<Hostel[]>(`${environment.baseUrl}/hostels/authorized`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/hostels/segment/search?page=${page}&order=${order}&keyword=${keyword}`, { responseType: "json" });
  }

  save(hostelDto: Hostel): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/hostels`, hostelDto, { responseType: "json" });
  }

  update(hostelDto: Hostel, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/hostels/${id}`, hostelDto, { responseType: "json" });
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/hostels/${id}`, { responseType: "json" });
  }

  authorize(id: number, authorizedUserId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/hostels/${id}/authorize/${authorizedUserId}`, { responseType: "json" });
  }
  
}
