import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { saveAs } from 'file-saver-es';
import { ToastrService } from 'ngx-toastr';
import { showError } from 'src/app/common/showError';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { CustomPaginationResponse } from 'src/app/model/CustomPaginationResponse';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { Grade } from 'src/app/model/Grade';
import { TableHeader } from 'src/app/model/TableHeader';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { AttendanceService } from 'src/app/service/attendance.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { GradeService } from 'src/app/service/grade.service';
import { UserService } from 'src/app/service/user.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {

  searched = false;
  valid = false;
  userInfo!: ApplicationUser;
  pageData: CustomPaginationResponse = new CustomPaginationResponse();
  currentPage: number = 1;
  sortedData: any[] = [];
  dataList: any[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  academicYearList!: AcademicYear[];
  examTitleList!: ExamTitle[];
  gradeList!: Grade[];
  searchedAcademicYear: number = 0;
  searchedExamTitle: number = 0;
  searchedGrade: number = 0;
  keyword: string = "";
  tableHeader: TableHeader = new TableHeader();

  form: FormGroup = new FormGroup({
    academicYear: new FormControl('', [
      Validators.required
    ]),
    examTitle: new FormControl('', [
      Validators.required
    ]),
    grade: new FormControl('', [
      Validators.required
    ]),
    keyword: new FormControl('', [
      whiteSpaceValidator()
    ])
  });

  constructor(
    private academicYearSerivce: AcademicYearService,
    private examTitleService: ExamTitleService,
    private gradeService: GradeService,
    private attendanceService: AttendanceService,
    private userService: UserService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['currentPage'] != undefined && params['currentPage'] != 1) {
        this.currentPage = Number(params['currentPage']);
      }
      this.searchedAcademicYear = params['searchedAcademicYear'] == undefined ? 0 : params['searchedAcademicYear'];
      this.searchedExamTitle = params['searchedExamTitle'] == undefined ? 0 : params['searchedExamTitle'];
      this.searchedGrade = params['searchedGrade'] == undefined ? 0 : params['searchedGrade'];
      this.keyword = params['keyword'] == undefined ? '' : params['keyword'];
      this.searched = params['searched'] == undefined ? false : Boolean(params['searched']);
    });

    this.academicYearSerivce.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.examTitleService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.examTitleList = data;
    });
    this.gradeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.gradeList = data;
    });

    if (this.searched) {
      this.valid = true;
      this.attendanceService.fetchPresentPageSegmentBySearching(this.currentPage, this.searchedAcademicYear, this.searchedExamTitle, this.searchedGrade, this.keyword).subscribe({
        next: (res: CustomPaginationResponse) => {
          this.setDataInCurrentPage(res);
          this.tableHeader = res.tableHeader;
        },
        error: (err) => {
          showError(this.toastrService, this.router, err);
        }
      });

      this.form.get('academicYear')!.setValue(+this.searchedAcademicYear);
      this.form.get('examTitle')!.setValue(+this.searchedExamTitle);
      this.form.get('grade')!.setValue(+this.searchedGrade);
      this.form.get('keyword')!.setValue(this.keyword);
    }

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
          return this.compare(a.attendance.studentClass.regNo, b.attendance.studentClass.regNo, isAsc);
        case 'name':
          return this.compare(a.attendance.studentClass.student.name, b.attendance.studentClass.student.name, isAsc);
        case 'fatherName':
          return this.compare(a.attendance.studentClass.student.fatherName, b.attendance.studentClass.student.fatherName, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  search() {
    this.searched = true;
    this.currentPage = 1;
    this.searchedAcademicYear = this.form.get('academicYear')!.value;
    this.searchedExamTitle = this.form.get('examTitle')!.value;
    this.searchedGrade = this.form.get('grade')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if (this.form.invalid) {
      return;
    }

    this.valid = true;
    this.attendanceService.fetchPresentPageSegmentBySearching(this.currentPage, this.searchedAcademicYear, this.searchedExamTitle, this.searchedGrade, this.keyword).subscribe({
      next: (res: CustomPaginationResponse) => {
        this.setDataInCurrentPage(res);
        this.tableHeader = res.tableHeader;
        this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  reset() {
    this.form.reset();
    this.form.get('academicYear')!.setValue('');
    this.form.get('examTitle')!.setValue('');
    this.form.get('grade')!.setValue('');
    this.form.get('keyword')!.setValue("");
    this.searched = false;
    this.currentPage = 1;
    this.searchedAcademicYear = 0;
    this.searchedExamTitle = 0;
    this.searchedGrade = 0;
    this.keyword = "";
    this.valid = false;
    this.pageData = new CustomPaginationResponse();
    this.sortedData = [];
    this.dataList = [];
    this.tableHeader = new TableHeader();
  }

  enterPaginationEvent(currentPageEnterValue: number) {
    this.currentPage = currentPageEnterValue;

    this.attendanceService.fetchPresentPageSegmentBySearching(this.currentPage, this.searchedAcademicYear, this.searchedExamTitle, this.searchedGrade, this.keyword).subscribe({
      next: (res: CustomPaginationResponse) => {
        this.setDataInCurrentPage(res);
        this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  exportToExcel() {
    if (this.sortedData.length == 0) {
      this.toastrService.warning("There is no record to export.", "Not Found");
    } else {
      this.attendanceService.exportToExcel(this.searchedAcademicYear, this.searchedExamTitle, this.searchedGrade, this.keyword).subscribe({
        next: (response) => {
          let file = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          let filename = 'attendance_' + format(new Date(), 'dd-MM-yyyy HH:mm:ss') + '.xlsx';
          saveAs(file, filename);
          this.toastrService.success("Successfully Exported.");
        },
        error: (err) => {
          showError(this.toastrService, this.router, err);
        }
      });
    }
  }

  viewAttendanceDetail(studentClassId: string) {
    this.router.navigate(['/app/attendance/detail'], {
      queryParams: {
        studentClassId: studentClassId,
        currentPage: this.currentPage,
        searchedAcademicYear: this.searchedAcademicYear,
        searchedExamTitle: this.searchedExamTitle,
        searchedGrade: this.searchedGrade,
        keyword: this.keyword,
        searched: this.searched
      },
      skipLocationChange: true
    });
  }

  setDataInCurrentPage(res: CustomPaginationResponse) {
    if (res.totalElements == 0) { this.currentPage = 0 }
    this.pageData = res;
    let pageSize = res.pageSize;
    let i = (this.currentPage - 1) * pageSize;
    this.dataList = this.pageData.elements.map(data => {
      let obj = { 'index': ++i, ...data };
      return obj;
    });
    this.sortedData = [...this.dataList];
  }

}
