import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ApplicationUser } from '../model/ApplicationUser';
import { ApiResponse } from '../model/ApiResponse';
import { PaginationResponse } from '../model/PaginationResponse';
import { PaginationOrder } from '../common/PaginationOrder';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  fetchApplicationUserByUsername(userName: string): Observable<ApplicationUser> {
    return this.http.get<ApplicationUser>(`${environment.baseUrl}/app-users`, {  responseType: "json" });
  }

  storeUserProfileInfo(userInfo: ApplicationUser): void {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  fetchUserProfileInfo(): ApplicationUser {
    return JSON.parse(localStorage.getItem('userInfo')!);
  }

  fetchById(id: number): Observable<ApplicationUser> {
    return this.http.get<ApplicationUser>(`${environment.baseUrl}/app-users/${id}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, roleId: number, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/app-users/segment/search?page=${page}&order=${order}&roleId=${roleId}&keyword=${keyword}`, { responseType: "json" });
  }

  save(applicationUserDto: ApplicationUser): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/app-users`, applicationUserDto, { responseType: "json" });
  }

  update(applicationUserDto: ApplicationUser, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/app-users/profile/${id}`, applicationUserDto, { responseType: "json" });
  }

  updateAppUser(applicationUserDto: ApplicationUser, id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/app-users/${id}`, applicationUserDto, { responseType: "json" });
  }

  changeActiveStatus(id: number, activeStatus: boolean): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/app-users/${id}/status?activeStatus=${activeStatus}`, { responseType: "json" });
  }

  exportToExcel(roleId: number, keyword: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/app-users/export-to-excel?roleId=${roleId}&keyword=${keyword}`, { responseType: "arraybuffer" as "json" });
  }
  
}
