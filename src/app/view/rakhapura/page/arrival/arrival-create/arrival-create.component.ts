import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaginationOrder } from 'src/app/common/PaginationOrder';
import { showError } from 'src/app/common/showError';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { DataResponse } from 'src/app/model/DataResponse';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { Grade } from 'src/app/model/Grade';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ArrivalService } from 'src/app/service/arrival.service';
import { ClassService } from 'src/app/service/class.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { GradeService } from 'src/app/service/grade.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';

@Component({
  selector: 'app-arrival-create',
  templateUrl: './arrival-create.component.html',
  styleUrls: ['./arrival-create.component.css']
})
export class ArrivalCreateComponent implements OnInit {

  pageData: PaginationResponse = new PaginationResponse();
  currentPage: number = 1;
  sortedData: any[] = [];
  dataList: any[] = [];
  submitted = false;
  isCheckAll = false;
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
  idList: string[] = [];

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
    private toastrService: ToastrService,
    private router: Router,
    private matDialog: MatDialog
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

    this.arrivalService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.ASC, false, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
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

  submit() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.idList.length == 0) {
          this.toastrService.warning("Please check students first.", "Not Finished Yet");
          return;
        }

        this.arrivalService.save(this.idList).subscribe({
          next: (res: DataResponse) => {
            if (res.status == HttpStatusCode.Created) {
              let size = res.createdCount;
              let message = "Successfully Arrived ";
              message += size > 1 ? size + " Records" : size + " Record";
              this.toastrService.success(message);
              this.arrivalService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.ASC, false, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
                next: (res: PaginationResponse) => {
                  if (this.currentPage > res.totalPages && res.totalPages != 0) {
                    this.currentPage = res.totalPages;
                    this.arrivalService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.ASC, false, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
                      next: (response: PaginationResponse) => {
                        this.setDataInCurrentPage(response);
                        this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
                        this.idList = [];
                        this.isCheckAll = false;
                      },
                      error: (err) => {
                        showError(this.toastrService, this.router, err);
                      }
                    });
                  } else {
                    this.setDataInCurrentPage(res);
                    this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
                    this.idList = [];
                    this.isCheckAll = false;
                  }
                },
                error: (err) => {
                  showError(this.toastrService, this.router, err);
                }
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

  checkUncheckAll() {
    let isExist = false;
    let index = 0;

    for (let i = 0; i < this.sortedData.length; i++) {
      this.sortedData[i].check = this.isCheckAll;
      for (let j = 0; j < this.idList.length; j++) {
        if (this.idList[j] == this.sortedData[i].id) {
          isExist = true;
          index = j;
          break;
        }
      }
      if (!isExist) {
        this.idList.push(this.sortedData[i].id);
      }
      if (!this.sortedData[i].check) {
        this.idList.splice(index, 1);
      }
    }
  }

  isAllSelected(event: any, id: string) {
    this.isCheckAll = this.sortedData.every(function (item: any) {
      return item.check == true;
    });
    if (event.target.checked) {
      this.idList.push(id);
    } else {
      for (let i = 0; i < this.idList.length; i++) {
        if (this.idList[i] == id) {
          this.idList.splice(i, 1);
        }
      }
    }
  }

  search() {
    this.submitted = true;
    this.isCheckAll = false;
    this.currentPage = 1;
    this.idList = [];
    this.searchedExamTitle = this.form.get('examTitle')!.value;
    this.searchedAcademicYear = this.form.get('academicYear')!.value;
    this.searchedGrade = this.form.get('grade')!.value;
    this.searchedClass = this.form.get('class')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if (this.form.invalid) {
      return;
    }

    this.arrivalService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, false, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
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
    this.isCheckAll = false;
    this.currentPage = 1;
    this.idList = [];
    this.searchedExamTitle = 0;
    this.searchedAcademicYear = 0;
    this.searchedGrade = 0;
    this.searchedClass = "All";
    this.keyword = "";

    this.arrivalService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, false, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
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

    this.arrivalService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, false, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        if (res.totalElements == 0) { this.currentPage = 0 }
        this.pageData = res;
        let pageSize = res.pageSize;
        let i = (this.currentPage - 1) * pageSize;
        this.dataList = this.pageData.elements.map(data => {
          let obj = { 'index': ++i, ...data };
          for (let j = 0; j < this.idList.length; j++) {
            if (data.id == this.idList[j]) {
              obj.check = true;
            }
          }
          return obj;
        });
        this.sortedData = [...this.dataList];
        this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
        this.isCheckAll = this.sortedData.every(function (item: any) {
          return item.check == true;
        });
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  setDataInCurrentPage(res: PaginationResponse) {
    if (res.totalElements == 0) { this.currentPage = 0 }
    this.pageData = res;
    let pageSize = res.pageSize;
    let i = (this.currentPage - 1) * pageSize;
    this.dataList = this.pageData.elements.map(data => {
      let obj = { 'index': ++i, 'check': false, ...data };
      return obj;
    });
    this.sortedData = [...this.dataList];
  }

}
