import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentExam } from '../model/StudentExam';
import { ApiResponse } from '../model/ApiResponse';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { StudentExamModerate } from '../model/StudentExamModerate';

@Injectable({
  providedIn: 'root'
})
export class StudentExamModerateService {

  constructor(private http: HttpClient) { }

  fetchFilteredByExamSubjectAndAttendance(examSubjectId: number, attendanceId: string): Observable<StudentExamModerate> {
    return this.http.get<StudentExamModerate>(`${environment.baseUrl}/student-exam-moderates/filterOne?examSubjectId=${examSubjectId}&attendanceId=${attendanceId}`, { responseType: "json" });
  }

  moderate(studentExamDto: StudentExam): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/student-exam-moderates`, studentExamDto, { responseType: "json" });
  }

}
