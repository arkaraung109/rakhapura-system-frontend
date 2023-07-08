import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { NewTokenRequest } from '../model/NewTokenRequest';
import { JWTToken } from '../model/JWTToken';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  authenticate(userId: string, password: string): Observable<any> {
    let req: NewTokenRequest = new NewTokenRequest();
    req.userID = userId;
    req.password = password;
    return this.http.post<any>(`${environment.baseUrl}/authenticate`, req, { responseType: "json" });
  }

  storeJwtToken(token: JWTToken): void {
    localStorage.setItem('access_token', token.access_token);
  }

  getJwtToken(): string {
    return localStorage.getItem('access_token')!;
  }
  
}
