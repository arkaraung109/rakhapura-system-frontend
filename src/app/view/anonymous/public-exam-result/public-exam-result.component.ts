import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { showError } from 'src/app/common/showError';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { Grade } from 'src/app/model/Grade';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { GradeService } from 'src/app/service/grade.service';
import { PublicExamResultService } from 'src/app/service/public-exam-result.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';

@Component({
  selector: 'app-public-exam-result',
  templateUrl: './public-exam-result.component.html',
  styleUrls: ['./public-exam-result.component.css']
})
export class PublicExamResultComponent implements OnInit {

  submitted = false;
  valid = false;
  pageData: PaginationResponse = new PaginationResponse();
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
    private academicYearService: AcademicYearService,
    private examTitleService: ExamTitleService,
    private gradeService: GradeService,
    private publicExamResultService: PublicExamResultService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.academicYearService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.examTitleService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.examTitleList = data;
    });
    this.gradeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.gradeList = data;
    });
  }

  search() {
    this.submitted = true;
    this.currentPage = 1;
    this.searchedAcademicYear = this.form.get('academicYear')!.value;
    this.searchedExamTitle = this.form.get('examTitle')!.value;
    this.searchedGrade = this.form.get('grade')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if (this.form.invalid) {
      return;
    }

    this.valid = true;
    this.publicExamResultService.fetchPageSegmentBySearching(this.currentPage, this.searchedAcademicYear, this.searchedExamTitle, this.searchedGrade, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
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
        case 'monasteryHeadmaster':
          return this.compare(a.studentClass.student.monasteryHeadmaster, b.studentClass.student.monasteryHeadmaster, isAsc);
        case 'monasteryName':
          return this.compare(a.studentClass.student.monasteryName, b.studentClass.student.monasteryName, isAsc);
        case 'region':
          return this.compare(a.studentClass.student.region.name, b.studentClass.student.region.name, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  enterPaginationEvent(currentPageEnterValue: number) {
    this.currentPage = currentPageEnterValue;

    this.publicExamResultService.fetchPageSegmentBySearching(this.currentPage, this.searchedAcademicYear, this.searchedExamTitle, this.searchedGrade, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  reset() {
    location.reload();
  }

  back() {
    this.router.navigate(['/anonymous/home']);
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
  }

}
