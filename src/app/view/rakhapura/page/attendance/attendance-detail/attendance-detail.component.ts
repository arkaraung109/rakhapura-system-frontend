import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { showError } from 'src/app/common/showError';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { StudentClass } from 'src/app/model/StudentClass';
import { AttendanceService } from 'src/app/service/attendance.service';
import { ExamSubjectService } from 'src/app/service/exam-subject.service';
import { ExamService } from 'src/app/service/exam.service';
import { StudentClassService } from 'src/app/service/student-class.service';
import { StudentExamService } from 'src/app/service/student-exam.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.css']
})
export class AttendanceDetailComponent implements OnInit {

  searched = false;
  userInfo!: ApplicationUser;
  sortedData: any[] = [];
  dataList: any[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  studentClass: StudentClass = new StudentClass();
  studentClassId!: string;
  currentPage!: number;
  searchedExamTitle!: number;
  searchedAcademicYear!: number;
  searchedGrade!: number;
  keyword!: string;
  totalPassMark: number = 0;
  totalMarkPercentage: number = 0;
  alreadyPublished = false;

  constructor(
    private examService: ExamService,
    private examSubjectService: ExamSubjectService,
    private studentClassService: StudentClassService,
    private attendanceService: AttendanceService,
    private studentExamService: StudentExamService,
    private userService: UserService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.studentClassId = params['studentClassId'];
      this.currentPage = params['currentPage'];
      this.searchedExamTitle = params['searchedExamTitle'];
      this.searchedAcademicYear = params['searchedAcademicYear'];
      this.searchedGrade = params['searchedGrade'];
      this.keyword = params['keyword'];
      this.searched = params['searched'];
    });
    this.studentClassService.fetchById(this.studentClassId).subscribe(data => {
      this.studentClass = data;
    });
    this.attendanceService.fetchByPresentStudentClass(this.studentClassId).subscribe(data => {
      this.sortedData = [...data];

      if(this.sortedData.length != 0) {
        if(this.sortedData[0].exam.published) {
          this.alreadyPublished = true;
        }
      }
      
      for (let i = 0; i < this.sortedData.length; i++) {
        this.studentExamService.fetchTotalMark(this.sortedData[i].id).subscribe(mark => {
          this.sortedData[i].index = i + 1;

          if (mark == null) {
            this.sortedData[i].mark = '-';
          } else {
            this.sortedData[i].mark = mark;
          }

          this.studentExamService.fetchResult(this.sortedData[i].id).subscribe(result => {
            if (this.sortedData[i].mark != '-') {
              if ((this.sortedData[i].mark >= this.sortedData[i].exam.passMark) && (result == 1)) {
                this.sortedData[i].result = 'အောင်';
              } else {
                this.sortedData[i].result = 'ရှုံး';
              }
            }
          });
        });
      }
      this.dataList = [...this.sortedData];
    });

    if (localStorage.getItem("status") === "created") {
      this.toastrService.success("Successfully Created.");
    } else if (localStorage.getItem("status") === "updated") {
      this.toastrService.success("Successfully Updated.");
    }

    localStorage.removeItem("status");
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
        case 'subjectType':
          return this.compare(a.exam.subjectType.name, b.exam.subjectType.name, isAsc);
        case 'mark':
          return this.compare(a.mark, b.mark, isAsc);
        case 'passMark':
          return this.compare(a.exam.passMark, b.exam.passMark, isAsc);
        case 'markPercentage':
          return this.compare(a.exam.markPercentage, b.exam.markPercentage, isAsc);
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

  navigateToSaveForm(attendanceId: string, examId: number) {
    if (this.alreadyPublished) {
      this.toastrService.warning("You cannot save anymore.", "Already Published Exam Results");
    } else {
      this.studentExamService.fetchByAttendance(attendanceId).subscribe({
        next: (data) => {
          this.examService.fetchById(examId).subscribe(exam => {
            this.examSubjectService.fetchAllAuthorizedByExam(exam.id).subscribe(examSubjectList => {
              for (let examSubject of examSubjectList) {
                this.totalPassMark += examSubject.passMark;
                this.totalMarkPercentage += examSubject.markPercentage;
              }
              if (this.totalPassMark < exam.passMark) {
                this.toastrService.warning("Sum of pass mark of subjects does not match with its exam's pass mark.", "Action Needed");
              }
              if (this.totalMarkPercentage < exam.markPercentage) {
                this.toastrService.warning("Sum of mark percentage of subjects does not match with its exam's mark percentage.", "Action Needed");
              }
              if (data.length != 0) {
                this.toastrService.warning("You cannot save anymore.", "Already Created");
              }
              if (this.totalPassMark == exam.passMark && this.totalMarkPercentage == exam.markPercentage && data.length == 0) {
                this.router.navigate(['app/student-exam/create'], {
                  queryParams: {
                    attendanceId: attendanceId,
                    examId: examId,
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
            });
          });
        },
        error: (err) => {
          showError(this.toastrService, this.router, err);
        }
      });
    }
  }

  navigateToEditForm(attendanceId: string, examId: number) {
    if (this.alreadyPublished) {
      this.toastrService.warning("You cannot update anymore.", "Already Published Exam Results");
    } else {
      this.studentExamService.fetchByAttendance(attendanceId).subscribe({
        next: (data) => {
          if (data.length == 0) {
            this.toastrService.warning("Please add score in this exam first.", "Action Needed");
          } else {
            this.router.navigate(['app/student-exam/edit'], {
              queryParams: {
                attendanceId: attendanceId,
                examId: examId,
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
    }
  }

  navigateToDetail(attendanceId: string, examId: number) {
    this.studentExamService.fetchByAttendance(attendanceId).subscribe({
      next: (data) => {
        if (data.length == 0) {
          this.toastrService.warning("Please add score in this exam first.", "Action Needed");
        } else {
          this.router.navigate(['app/student-exam/detail'], {
            queryParams: {
              attendanceId: attendanceId,
              examId: examId,
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
  }

  back() {
    this.router.navigate(['app/attendance/list'], {
      queryParams: {
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
