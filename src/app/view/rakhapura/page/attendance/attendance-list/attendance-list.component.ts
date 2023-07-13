import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { saveAs } from 'file-saver-es';
import { ToastrService } from 'ngx-toastr';
import { PaginationOrder } from 'src/app/common/PaginationOrder';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { SubjectType } from 'src/app/model/SubjectType';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { AttendanceService } from 'src/app/service/attendance.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { SubjectTypeService } from 'src/app/service/subject-type.service';
import { UserService } from 'src/app/service/user.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {

  pageData: PaginationResponse = new PaginationResponse();
  currentPage: number = 1;
  userInfo!: ApplicationUser;
  sortedData: any[] = [];
  dataList: any[] = [];
  submitted = false;
  @ViewChild(MatSort) sort!: MatSort;
  examTitleList!: ExamTitle[];
  academicYearList!: AcademicYear[];
  subjectTypeList!: SubjectType[];
  searchedExamTitle!: number;
  searchedAcademicYear!: number;
  searchedSubjectType!: number;
  keyword!: string;

  form: FormGroup = new FormGroup({
    examTitle: new FormControl(0),
    academicYear: new FormControl(0),
    subjectType: new FormControl(0),
    keyword: new FormControl('', [
      Validators.pattern("^[^<>~`!{}|@^*=?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ])
  });
  
  constructor(
    private examTitleService: ExamTitleService, 
    private academicYearSerivce: AcademicYearService,
    private subjectTypeService: SubjectTypeService,
    private attendanceService: AttendanceService,
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.examTitleService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.examTitleList = data;
    });
    this.academicYearSerivce.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.subjectTypeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.subjectTypeList = data;
    });

    this.attendanceService.fetchPageSegment(this.currentPage, PaginationOrder.DESC, true).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        this.toastrService.error("Error message", "Something went wrong.");
      }
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
        case 'regNo':
          return this.compare(a.studentClass.regNo, b.studentClass.regNo, isAsc);
        case 'name':
          return this.compare(a.studentClass.student.name, b.studentClass.student.name, isAsc);
        case 'fatherName':
          return this.compare(a.studentClass.student.fatherName, b.studentClass.student.fatherName, isAsc);
        case 'academicYear':
          return this.compare(a.exam.academicYear.name, b.exam.academicYear.name, isAsc);
        case 'examTitle':
          return this.compare(a.exam.examTitle.name, b.exam.examTitle.name, isAsc);
        case 'subjectType':
          return this.compare(a.exam.subjectType.name + " (" + a.exam.subjectType.grade.name + ")", b.exam.subjectType.name + " (" + b.exam.subjectType.grade.name + ")", isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  search() {
    this.submitted = true;
    this.currentPage = 1;
    this.searchedExamTitle = this.form.get('examTitle')!.value;
    this.searchedAcademicYear = this.form.get('academicYear')!.value;
    this.searchedSubjectType = this.form.get('subjectType')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if(this.form.invalid) {
      return;
    }
    
    if(this.searchedExamTitle == 0 && this.searchedAcademicYear == 0 && this.searchedSubjectType == 0 && this.keyword === '') {
      this.attendanceService.fetchPageSegment(this.currentPage, PaginationOrder.DESC, true).subscribe({
        next: (res: PaginationResponse) => {
          this.setDataInCurrentPage(res);
          this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
    } else {
      this.attendanceService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, true, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.keyword).subscribe({
        next: (res: PaginationResponse) => {
          this.setDataInCurrentPage(res);
          this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
    }
  }

  reset() {
    location.reload();
  }

  enterPaginationEvent(currentPageEnterValue: number) {
    this.currentPage = currentPageEnterValue;

    if(!this.submitted || (this.searchedExamTitle == 0 && this.searchedAcademicYear == 0 && this.searchedSubjectType == 0 && this.keyword === '')) {
      this.attendanceService.fetchPageSegment(this.currentPage, PaginationOrder.DESC, true).subscribe({
        next: (res: PaginationResponse) => {
          this.setDataInCurrentPage(res);
          this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
    } else { 
      this.attendanceService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, true, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.keyword).subscribe({
        next: (res: PaginationResponse) => {
          this.setDataInCurrentPage(res);
          this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
    }
  }

  exportToExcel() {
    this.attendanceService.exportToExcel().subscribe({
      next: (response) => {
        let file = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        let filename = 'attendance_' + format(new Date(), 'dd-MM-yyyy HH:mm:ss') + '.xlsx';
        saveAs(file, filename);
        this.toastrService.success("Successfully Exported.");
      },
      error: (error) => {
        this.toastrService.error("Error message", "Something went wrong.");
      }
    });
  }

  addScore(id: number) {
    this.router.navigate(['/app/attendance/detail'], {
      queryParams: {
          id: id
      },
      skipLocationChange: true
    });
  }

  setDataInCurrentPage(res: PaginationResponse) {
    if(res.totalElements == 0) {this.currentPage = 0}
    this.pageData = res;
    let pageSize = res.pageSize;
    let i = (this.currentPage - 1) * pageSize;
    this.dataList = this.pageData.elements.map(data => {
      let obj = {'index': ++i, ...data};
      return obj;
    });
    this.sortedData = [...this.dataList];
  }

}