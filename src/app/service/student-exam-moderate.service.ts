import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentExam } from '../model/StudentExam';
import { ApiResponse } from '../model/ApiResponse';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { StudentExamModerate } from '../model/StudentExamModerate';
import { CustomPaginationResponse } from '../model/CustomPaginationResponse';

@Injectable({
  providedIn: 'root'
})
export class StudentExamModerateService {

  constructor(private http: HttpClient) { }

  fetchFilteredByExamSubjectAndAttendance(examSubjectId: number, attendanceId: string): Observable<StudentExamModerate> {
    return this.http.get<StudentExamModerate>(`${environment.baseUrl}/student-exam-moderates/filterOne?examSubjectId=${examSubjectId}&attendanceId=${attendanceId}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, academicYearId: number, examTitleId: number, gradeId: number, keyword: string): Observable<CustomPaginationResponse> {
    return this.http.get<CustomPaginationResponse>(`${environment.baseUrl}/student-exam-moderates/result/search?page=${page}&academicYearId=${academicYearId}&examTitleId=${examTitleId}&gradeId=${gradeId}&keyword=${keyword}`, { responseType: "json" });
  }

  moderate(studentExamDto: StudentExam): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/student-exam-moderates`, studentExamDto, { responseType: "json" });
  }

  exportToExcel(academicYearId: number, examTitleId: number, gradeId: number, keyword: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/student-exam-moderates/export-to-excel?academicYearId=${academicYearId}&examTitleId=${examTitleId}&gradeId=${gradeId}&keyword=${keyword}`, { responseType: "arraybuffer" as "json" });
  }

}
