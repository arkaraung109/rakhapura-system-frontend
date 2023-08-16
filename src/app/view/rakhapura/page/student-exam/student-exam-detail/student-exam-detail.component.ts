import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { showError } from 'src/app/common/showError';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { StudentClass } from 'src/app/model/StudentClass';
import { StudentExam } from 'src/app/model/StudentExam';
import { SubjectType } from 'src/app/model/SubjectType';
import { ExamService } from 'src/app/service/exam.service';
import { StudentClassService } from 'src/app/service/student-class.service';
import { StudentExamModerateService } from 'src/app/service/student-exam-moderate.service';
import { StudentExamService } from 'src/app/service/student-exam.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-student-exam-detail',
  templateUrl: './student-exam-detail.component.html',
  styleUrls: ['./student-exam-detail.component.css']
})
export class StudentExamDetailComponent implements OnInit {

  searched = false;
  userInfo!: ApplicationUser;
  sortedData: any[] = [];
  dataList: any[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  subjectType: SubjectType = new SubjectType();
  studentClass: StudentClass = new StudentClass();
  studentClassId!: string;
  attendanceId!: string;
  examId!: number;
  currentPage!: number;
  searchedExamTitle!: number;
  searchedAcademicYear!: number;
  searchedGrade!: number;
  keyword!: string;
  totalMark: number = 0;
  alreadyPublished = false;

  constructor(
    private examService: ExamService,
    private studentClassService: StudentClassService,
    private studentExamService: StudentExamService,
    private studentExamModerateService: StudentExamModerateService,
    private userService: UserService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
  ) { }

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
    this.studentClassService.fetchById(this.studentClassId).subscribe(data => {
      this.studentClass = data;
    });

    this.studentExamService.fetchByAttendance(this.attendanceId).subscribe(data => {
      this.sortedData = [...data];
      
      if(this.sortedData.length != 0) {
        if(this.sortedData[0].examSubject.exam.published) {
          this.alreadyPublished = true;
        }
      }
      for (let i = 0; i < this.sortedData.length; i++) {
        this.studentExamModerateService.fetchFilteredByExamSubjectAndAttendance(this.sortedData[i].examSubject.id, this.attendanceId).subscribe(studentExamModerate => {
          this.sortedData[i].index = i + 1;
          if (!this.sortedData[i].pass) {
            this.sortedData[i].result = 'ရှုံး';
          } else {
            this.sortedData[i].result = 'အောင်';
            if (studentExamModerate != null) {
              this.sortedData[i].result = 'ကုစား';
            }
          }
          this.sortedData[i].moderatedMark = studentExamModerate?.mark;
        });
      }
      this.dataList = [...this.sortedData];
    });
    
    this.userInfo = this.userService.fetchUserProfileInfo();
  }

  sortData(sort: Sort) {
    let data = [...this.dataList];

    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      let isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'index':
          return this.compare(a.index, b.index, isAsc);
        case 'subject':
          return this.compare(a.examSubject.subject.name, b.examSubject.subject.name, isAsc);
        case 'mark':
          return this.compare(a.mark, b.mark, isAsc);
        case 'passMark':
          return this.compare(a.examSubject.passMark, b.examSubject.passMark, isAsc);
        case 'markPercentage':
          return this.compare(a.examSubject.markPercentage, b.examSubject.markPercentage, isAsc);
        case 'moderatedMark':
          return this.compare(a.moderatedMark, b.moderatedMark, isAsc);
        case 'result':
          return this.compare(a.result, b.result, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  moderate(studentExamId: string) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestBody: StudentExam = new StudentExam();
        requestBody.id = studentExamId;
        if (this.alreadyPublished) {
          this.toastrService.warning("You cannot moderate this.", "Already Published Exam Results");
        } else {
          this.studentExamModerateService.moderate(requestBody).subscribe({
            next: (res: ApiResponse) => {
              if (res.status == HttpStatusCode.Created) {
                this.studentExamService.fetchByAttendance(this.attendanceId).subscribe(data => {
                  this.sortedData = [...data];
                  for (let i = 0; i < this.sortedData.length; i++) {
                    this.studentExamModerateService.fetchFilteredByExamSubjectAndAttendance(this.sortedData[i].examSubject.id, this.attendanceId).subscribe(studentExamModerate => {
                      this.sortedData[i].index = i + 1;
                      if (!this.sortedData[i].pass) {
                        this.sortedData[i].result = 'ရှုံး';
                      } else {
                        this.sortedData[i].result = 'အောင်';
                        if (studentExamModerate != null) {
                          this.sortedData[i].result = 'ကုစား';
                        }
                      }
                      this.sortedData[i].moderatedMark = studentExamModerate?.mark;
                    });
                  }
                  this.dataList = [...this.sortedData];
                });
              }
            },
            error: (err) => {
              showError(this.toastrService, this.router, err);
            }
          });
        }
      } else {
        this.matDialog.closeAll();
      }
    });
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
