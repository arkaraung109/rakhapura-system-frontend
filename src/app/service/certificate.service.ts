import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Certificate } from '../model/Certificate';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient) { }

  generate(certificate: Certificate): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/certificates`, certificate, { responseType: "arraybuffer" as "json" });
  }

}
