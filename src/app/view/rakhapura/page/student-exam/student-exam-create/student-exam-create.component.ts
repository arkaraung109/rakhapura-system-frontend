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
  selector: 'app-student-exam-create',
  templateUrl: './student-exam-create.component.html',
  styleUrls: ['./student-exam-create.component.css']
})
export class StudentExamCreateComponent implements OnInit {

  submitted = false;
  searched = false;
  examSubjectList: ExamSubject[] = [];
  subjectType: SubjectType = new SubjectType();
  studentClassId!: string;
  attendanceId!: string;
  examId!: number;
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
      this.examSubjectList.forEach(es => {
        let markGroup = this.fb.group({
          mark: new FormControl('', [Validators.required, maxMarkValidator(es.markPercentage)])
        });
        this.markList.push(markGroup);
      });
    });
  }

  get markList() {
    return this.form.controls['markList'] as FormArray;
  }

  save() {
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
          requestBody.mark = this.markList.controls[i].get('mark')!.value;
          requestBody.examSubject.id = this.examSubjectList[i].id;
          requestBody.attendance.id = this.attendanceId;
          studentExamList.push(requestBody);
        }

        this.studentExamService.save(studentExamList).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Created) {
              localStorage.setItem("status", "created");
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
    this.form.reset();
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
