import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { saveAs } from 'file-saver-es';
import { ToastrService } from 'ngx-toastr';
import { showError } from 'src/app/common/showError';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { CustomPaginationResponse } from 'src/app/model/CustomPaginationResponse';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { Grade } from 'src/app/model/Grade';
import { TableHeader } from 'src/app/model/TableHeader';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { AttendanceService } from 'src/app/service/attendance.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { GradeService } from 'src/app/service/grade.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {

  searched = false;
  valid = false;
  pageData: CustomPaginationResponse = new CustomPaginationResponse();
  currentPage: number = 1;
  dataList: any[] = [];
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
      Validators.pattern("^[^<>~`!{}|@^*=?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ])
  });

  constructor(
    private academicYearSerivce: AcademicYearService,
    private examTitleService: ExamTitleService,
    private gradeService: GradeService,
    private attendanceService: AttendanceService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
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
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  reset() {
    location.reload();
  }

  enterPaginationEvent(currentPageEnterValue: number) {
    this.currentPage = currentPageEnterValue;

    this.attendanceService.fetchPresentPageSegmentBySearching(this.currentPage, this.searchedAcademicYear, this.searchedExamTitle, this.searchedGrade, this.keyword).subscribe({
      next: (res: CustomPaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  exportToExcel() {
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
  }

}
