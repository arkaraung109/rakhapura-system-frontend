import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentClass } from '../model/StudentClass';
import { environment } from 'src/environment/environment';
import { PaginationResponse } from '../model/PaginationResponse';
import { PaginationOrder } from '../common/PaginationOrder';
import { ApiResponse } from '../model/ApiResponse';
import { DataResponse } from '../model/DataResponse';

@Injectable({
  providedIn: 'root'
})
export class StudentClassService {

  constructor(private http: HttpClient) { }

  fetchById(id: string): Observable<StudentClass> {
    return this.http.get<StudentClass>(`${environment.baseUrl}/student-classes/${id}`, { responseType: "json" });
  }

  fetchPassedByAcademicYearAndExamTitleAndGrade(academicYearId: number, examTitleId: number, gradeId: number) :Observable<StudentClass[]> {
    return this.http.get<StudentClass[]>(`${environment.baseUrl}/student-classes/filter/passed?academicYearId=${academicYearId}&examTitleId=${examTitleId}&gradeId=${gradeId}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, order: PaginationOrder = PaginationOrder.DESC, examTitleId: number, academicYearId: number, gradeId: number, studentClass: string, keyword: string): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(`${environment.baseUrl}/student-classes/segment/search?page=${page}&order=${order}&examTitleId=${examTitleId}&academicYearId=${academicYearId}&gradeId=${gradeId}&studentClass=${studentClass}&keyword=${keyword}`, { responseType: "json" });
  }

  save(studentClassDto: StudentClass, idList: string[]): Observable<DataResponse> {
    return this.http.post<DataResponse>(`${environment.baseUrl}/student-classes?idList=${idList}`, studentClassDto, { responseType: "json" });
  }

  update(studentClassDto: StudentClass, id: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/student-classes/${id}`, studentClassDto, { responseType: "json" });
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/student-classes/${id}`, { responseType: "json" });
  }

  exportToExcel(examTitleId: number, academicYearId: number, gradeId: number, studentClass: string, keyword: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/student-classes/export-to-excel?examTitleId=${examTitleId}&academicYearId=${academicYearId}&gradeId=${gradeId}&studentClass=${studentClass}&keyword=${keyword}`, { responseType: "arraybuffer" as "json" });
  }
  
}
