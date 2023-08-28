import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { saveAs } from 'file-saver-es';
import { ToastrService } from 'ngx-toastr';
import { PaginationOrder } from 'src/app/common/PaginationOrder';
import { showError } from 'src/app/common/showError';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { Grade } from 'src/app/model/Grade';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ArrivalService } from 'src/app/service/arrival.service';
import { ClassService } from 'src/app/service/class.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { GradeService } from 'src/app/service/grade.service';
import { UserService } from 'src/app/service/user.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';

@Component({
  selector: 'app-arrival-list',
  templateUrl: './arrival-list.component.html',
  styleUrls: ['./arrival-list.component.css']
})
export class ArrivalListComponent implements OnInit {

  pageData: PaginationResponse = new PaginationResponse();
  currentPage: number = 1;
  userInfo!: ApplicationUser;
  sortedData: any[] = [];
  dataList: any[] = [];
  submitted = false;
  @ViewChild(MatSort) sort!: MatSort;
  examTitleList!: ExamTitle[];
  academicYearList!: AcademicYear[];
  gradeList!: Grade[];
  classList!: String[];
  searchedExamTitle: number = 0;
  searchedAcademicYear: number = 0;
  searchedGrade: number = 0;
  searchedClass: string = "All";
  keyword: string = "";

  form: FormGroup = new FormGroup({
    examTitle: new FormControl(0),
    academicYear: new FormControl(0),
    grade: new FormControl(0),
    class: new FormControl('All'),
    keyword: new FormControl('', [
      whiteSpaceValidator()
    ])
  });

  constructor(
    private examTitleService: ExamTitleService,
    private academicYearSerivce: AcademicYearService,
    private gradeService: GradeService,
    private classService: ClassService,
    private arrivalService: ArrivalService,
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
    this.gradeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.gradeList = data;
    });
    this.classService.fetchDistinctAll().subscribe(data => {
      this.classList = data;
    });

    this.arrivalService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, true, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
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
          return this.compare(a.regNo, b.regNo, isAsc);
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'fatherName':
          return this.compare(a.fatherName, b.fatherName, isAsc);
        case 'academicYear':
          return this.compare(a.studentClass.academicYear.name, b.studentClass.academicYear.name, isAsc);
        case 'examTitle':
          return this.compare(a.examTitle.name, b.examTitle.name, isAsc);
        case 'grade':
          return this.compare(a.studentClass.grade.name, b.studentClass.grade.name, isAsc);
        case 'class':
          return this.compare(a.studentClass.name, b.studentClass.name, isAsc);
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
    this.searchedGrade = this.form.get('grade')!.value;
    this.searchedClass = this.form.get('class')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if (this.form.invalid) {
      return;
    }

    this.arrivalService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, true, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
        this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  reset() {
    this.form.get('examTitle')!.setValue(0);
    this.form.get('academicYear')!.setValue(0);
    this.form.get('grade')!.setValue(0);
    this.form.get('class')!.setValue("All");
    this.form.get('keyword')!.setValue("");
    this.submitted = false;
    this.currentPage = 1;
    this.searchedExamTitle = 0;
    this.searchedAcademicYear = 0;
    this.searchedGrade = 0;
    this.searchedClass = "All";
    this.keyword = "";

    this.arrivalService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, true, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
        this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  enterPaginationEvent(currentPageEnterValue: number) {
    this.currentPage = currentPageEnterValue;

    this.arrivalService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, true, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
        this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  exportToExcel() {
    if(this.sortedData.length == 0) {
      this.toastrService.warning("There is no record to export.", "Not Found");
    } else {
      this.arrivalService.exportToExcel(this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
        next: (response) => {
          let file = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          let filename = 'arrived_student_' + format(new Date(), 'dd-MM-yyyy HH:mm:ss') + '.xlsx';
          saveAs(file, filename);
          this.toastrService.success("Successfully Exported.");
        },
        error: (err) => {
          showError(this.toastrService, this.router, err);
        }
      });
    }
  }

  setDataInCurrentPage(res: PaginationResponse) {
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
