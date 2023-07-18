import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { StudentClass } from 'src/app/model/StudentClass';
import { AttendanceService } from 'src/app/service/attendance.service';
import { StudentClassService } from 'src/app/service/student-class.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.css']
})
export class AttendanceDetailComponent implements OnInit {

  userInfo!: ApplicationUser;
  sortedData: any[] = [];
  dataList: any[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  studentClass: StudentClass = new StudentClass();
  studentClassId!: string;
  attendanceId!: string;
  currentPage!: number;
  searchedExamTitle!: number;
  searchedAcademicYear!: number;
  searchedGrade!: number;
  searchedClass!: string;
  keyword!: string;

  constructor(
    private studentClassService: StudentClassService,
    private attendanceService: AttendanceService,
    private userService: UserService,
    private route: ActivatedRoute, 
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.studentClassId = params['studentClassId'];
      this.attendanceId = params['attendanceId'];
      this.currentPage = params['currentPage'];
      this.searchedExamTitle = params['searchedExamTitle'];
      this.searchedAcademicYear = params['searchedAcademicYear'];
      this.searchedGrade = params['searchedGrade'];
      this.searchedClass = params['searchedClass'];
      this.keyword = params['keyword'];
    }); 
    this.studentClassService.fetchById(this.studentClassId).subscribe(data => {
      this.studentClass = data;
    });
    this.attendanceService.fetchByStudentClassId(this.studentClassId).subscribe(data => {
      let i = 0;
      this.dataList = data.map(data => {
        let obj = {'index': ++i, ...data};
        return obj;
      });
      this.sortedData = [...this.dataList];
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
        case 'subjectType':
          return this.compare(a.exam.subjectType.name, b.exam.subjectType.name, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  addStudentExam(examId: number) {
    this.router.navigate(['app/student-exam/create'], {
      queryParams: {
        studentClassId: this.studentClassId,
        attendanceId: this.attendanceId,
        examId: examId,
        currentPage: this.currentPage,
        searchedExamTitle: this.searchedExamTitle,
        searchedAcademicYear: this.searchedAcademicYear,
        searchedGrade: this.searchedGrade,
        searchedClass: this.searchedClass,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

  back() {
    this.router.navigate(['app/attendance/list'], {
      queryParams: {
        currentPage: this.currentPage,
        searchedExamTitle: this.searchedExamTitle,
        searchedAcademicYear: this.searchedAcademicYear,
        searchedGrade: this.searchedGrade,
        searchedClass: this.searchedClass,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
