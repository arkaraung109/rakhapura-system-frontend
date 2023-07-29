import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentExam } from '../model/StudentExam';
import { ApiResponse } from '../model/ApiResponse';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { CustomPaginationResponse } from '../model/CustomPaginationResponse';

@Injectable({
  providedIn: 'root'
})
export class StudentExamService {

  constructor(private http: HttpClient) { }

  fetchTotalMark(attendanceId: string): Observable<number> {
    return this.http.get<number>(`${environment.baseUrl}/student-exams/totalMark?attendanceId=${attendanceId}`, { responseType: "json" });
  }

  fetchResult(attendanceId: string): Observable<number> {
    return this.http.get<number>(`${environment.baseUrl}/student-exams/result?attendanceId=${attendanceId}`, { responseType: "json" });
  }

  fetchFilteredByExamSubjectAndAttendance(examSubjectId: number, attendanceId: string): Observable<StudentExam> {
    return this.http.get<StudentExam>(`${environment.baseUrl}/student-exams/filterOne?examSubjectId=${examSubjectId}&attendanceId=${attendanceId}`, { responseType: "json" });
  }

  fetchByAttendance(id: string): Observable<StudentExam[]> {
    return this.http.get<StudentExam[]>(`${environment.baseUrl}/student-exams/attendance/${id}`, { responseType: "json" });
  }

  fetchPageSegmentBySearching(page: number, academicYearId: number, examTitleId: number, gradeId: number, keyword: string): Observable<CustomPaginationResponse> {
    return this.http.get<CustomPaginationResponse>(`${environment.baseUrl}/student-exams/result/search?page=${page}&academicYearId=${academicYearId}&examTitleId=${examTitleId}&gradeId=${gradeId}&keyword=${keyword}`, { responseType: "json" });
  }

  save(studentExamDtoList: StudentExam[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/student-exams`, studentExamDtoList, { responseType: "json" });
  }

  update(studentExamDtoList: StudentExam[]): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/student-exams`, studentExamDtoList, { responseType: "json" });
  }

  exportToExcel(academicYearId: number, examTitleId: number, gradeId: number, keyword: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/student-exams/export-to-excel?academicYearId=${academicYearId}&examTitleId=${examTitleId}&gradeId=${gradeId}&keyword=${keyword}`, { responseType: "arraybuffer" as "json" });
  }
  
}
