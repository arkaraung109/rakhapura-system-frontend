import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ApplicationUser } from '../model/ApplicationUser';

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
  
}
