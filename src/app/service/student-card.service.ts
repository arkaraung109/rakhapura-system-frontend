import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { PaginationOrder } from '../common/PaginationOrder';
import { PaginationResponse } from '../model/PaginationResponse';
import { StudentCard } from '../model/StudentCard';

@Injectable({
  providedIn: 'root'
})
export class StudentCardService {

  constructor(private http: HttpClient) { }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, examTitleId: number, academicYearId: number, gradeId: number): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/student-cards/segment/search?page=${page}&order=${order}&examTitleId=${examTitleId}&academicYearId=${academicYearId}&gradeId=${gradeId}`, { responseType: "json" });
  }

  generate(studentCard: StudentCard): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/student-cards`, studentCard, { responseType: "arraybuffer" as "json" });
  }

}
