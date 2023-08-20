import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRole } from '../model/UserRole';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  fetchAll(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${environment.baseUrl}/roles`, { responseType: "json" });
  } 
  
}
