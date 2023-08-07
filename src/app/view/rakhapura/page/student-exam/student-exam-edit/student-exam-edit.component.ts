import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { showError } from 'src/app/common/showError';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ExamSubject } from 'src/app/model/ExamSubject';
import { StudentExam } from 'src/app/model/StudentExam';
import { SubjectType } from 'src/app/model/SubjectType';
import { ExamSubjectService } from 'src/app/service/exam-subject.service';
import { ExamService } from 'src/app/service/exam.service';
import { StudentExamService } from 'src/app/service/student-exam.service';
import { maxMarkValidator } from 'src/app/validator/max-mark.validator';

@Component({
  selector: 'app-student-exam-edit',
  templateUrl: './student-exam-edit.component.html',
  styleUrls: ['./student-exam-edit.component.css']
})
export class StudentExamEditComponent implements OnInit {

  submitted = false;
  searched = false;
  examSubjectList: ExamSubject[] = [];
  subjectType: SubjectType = new SubjectType();
  studentClassId!: string;
  attendanceId!: string;
  examId!: number;
  oldStudentExam: StudentExam[] = [];
  currentPage!: number;
  searchedExamTitle!: number;
  searchedAcademicYear!: number;
  searchedGrade!: number;
  keyword!: string;

  constructor(
    private examService: ExamService,
    private examSubjectService: ExamSubjectService,
    private studentExamService: StudentExamService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private fb: FormBuilder
  ) { }

  form = this.fb.group({
    markList: this.fb.array([])
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.attendanceId = params['attendanceId'];
      this.examId = params['examId'];
      this.studentClassId = params['studentClassId'];
      this.currentPage = params['currentPage'];
      this.searchedExamTitle = params['searchedExamTitle'];
      this.searchedAcademicYear = params['searchedAcademicYear'];
      this.searchedGrade = params['searchedGrade'];
      this.keyword = params['keyword'];
      this.searched = params['searched'];
    });
    this.examService.fetchById(this.examId).subscribe(data => {
      this.subjectType = data.subjectType;
    });
    this.examSubjectService.fetchAllAuthorizedByExam(this.examId).subscribe(data => {
      this.examSubjectList = data;
      for (let i = 0; i < this.examSubjectList.length; i++) {
        let markGroup = this.fb.group({
          mark: new FormControl('', [Validators.required, maxMarkValidator(this.examSubjectList[i].markPercentage)])
        });
        this.markList.push(markGroup);
        this.studentExamService.fetchFilteredByExamSubjectAndAttendance(this.examSubjectList[i].id, this.attendanceId).subscribe(data => {
          let studentExam: StudentExam = new StudentExam();
          studentExam.id = data.id;
          studentExam.mark = data.mark;
          this.oldStudentExam.push(studentExam);
          this.markList.controls[i].get('mark')!.setValue(data.mark);
        });
      }
    });
  }

  get markList() {
    return this.form.controls['markList'] as FormArray;
  }

  update() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let studentExamList: StudentExam[] = [];
        for (let i = 0; i < this.examSubjectList.length; i++) {
          let requestBody: StudentExam = new StudentExam();
          requestBody.id = this.oldStudentExam[i].id;
          requestBody.mark = this.markList.controls[i].get('mark')!.value;
          requestBody.examSubject.id = this.examSubjectList[i].id;
          requestBody.attendance.id = this.attendanceId;
          studentExamList.push(requestBody);
        }

        this.studentExamService.update(studentExamList).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Ok) {
              localStorage.setItem("status", "updated");
              this.router.navigate(['/app/attendance/detail'], {
                queryParams: {
                  studentClassId: this.studentClassId,
                  currentPage: this.currentPage,
                  searchedExamTitle: this.searchedExamTitle,
                  searchedAcademicYear: this.searchedAcademicYear,
                  searchedGrade: this.searchedGrade,
                  keyword: this.keyword,
                  searched: this.searched
                },
                skipLocationChange: true
              });
            }
          },
          error: (err) => {
            showError(this.toastrService, this.router, err);
          }
        });
      } else {
        this.matDialog.closeAll();
      }
    });
  }

  reset() {
    for (let i = 0; i < this.markList.length; i++) {
      this.markList.controls[i].get('mark')!.setValue(this.oldStudentExam[i].mark);
    }
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/attendance/detail'], {
      queryParams: {
        studentClassId: this.studentClassId,
        currentPage: this.currentPage,
        searchedExamTitle: this.searchedExamTitle,
        searchedAcademicYear: this.searchedAcademicYear,
        searchedGrade: this.searchedGrade,
        keyword: this.keyword,
        searched: this.searched
      },
      skipLocationChange: true
    });
  }

}
