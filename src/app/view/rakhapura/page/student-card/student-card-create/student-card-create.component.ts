import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaginationOrder } from 'src/app/common/PaginationOrder';
import { showError } from 'src/app/common/showError';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { Grade } from 'src/app/model/Grade';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { ExamService } from 'src/app/service/exam.service';
import { GradeService } from 'src/app/service/grade.service';
import { StudentCardService } from 'src/app/service/student-card.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { saveAs } from 'file-saver-es';
import { format } from 'date-fns';
import { StudentCard } from 'src/app/model/StudentCard';

@Component({
  selector: 'app-student-card-create',
  templateUrl: './student-card-create.component.html',
  styleUrls: ['./student-card-create.component.css']
})
export class StudentCardCreateComponent implements OnInit {

  pageData: PaginationResponse = new PaginationResponse();
  currentPage: number = 1;
  sortedData: any[] = [];
  dataList: any[] = [];
  submitted = false;
  submittedForm = false;
  valid = false;
  isCheckAll = false;
  @ViewChild(MatSort) sort!: MatSort;
  examTitleList!: ExamTitle[];
  academicYearList!: AcademicYear[];
  gradeList!: Grade[];
  searchedExamTitle: number = 0;
  searchedAcademicYear: number = 0;
  searchedGrade: number = 0;
  idList: string[] = [];

  form: FormGroup = new FormGroup({
    academicYear: new FormControl('', [
      Validators.required
    ]),
    examTitle: new FormControl('', [
      Validators.required
    ]),
    grade: new FormControl('', [
      Validators.required
    ])
  });

  submitForm: FormGroup = new FormGroup({
    cardDate: new FormControl('', [
      Validators.required
    ]),
    examHoldingTimes: new FormControl('', [
      Validators.required,
      Validators.pattern("^([1-9]|[1-9][0-9]|1[0-9][0-9]|200)$"),
      whiteSpaceValidator()
    ])
  });

  constructor(
    private examTitleService: ExamTitleService,
    private academicYearSerivce: AcademicYearService,
    private gradeService: GradeService,
    private examService: ExamService,
    private studentCardService: StudentCardService,
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
          return this.compare(a.student.name, b.student.name, isAsc);
        case 'fatherName':
          return this.compare(a.student.fatherName, b.student.fatherName, isAsc);
        case 'monasteryHeadmaster':
          return this.compare(a.student.monasteryHeadmaster, b.student.monasteryHeadmaster, isAsc);
        case 'monasteryName':
          return this.compare(a.student.monasteryName, b.student.monasteryName, isAsc);
        case 'region':
          return this.compare(a.student.region.name, b.student.region.name, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  submit() {
    this.submittedForm = true;
    if (this.submitForm.invalid) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.idList.length == 0) {
          this.toastrService.warning("Please check students first.", "Not Finished Yet");
          return;
        }

        let academicYearId = this.form.get('academicYear')!.value;
        let examTitleId = this.form.get('examTitle')!.value;
        let gradeId = this.form.get('grade')!.value;
        let cardDate = this.submitForm.get('cardDate')!.value;
        let examHoldingTimes = this.submitForm.get('examHoldingTimes')!.value;
        let requestBody: StudentCard = new StudentCard();
        requestBody.academicYearId = academicYearId;
        requestBody.examTitleId = examTitleId;
        requestBody.gradeId = gradeId;
        requestBody.cardDate = cardDate;
        requestBody.examHoldingTimes = examHoldingTimes;
        requestBody.idList = this.idList;

        this.examService.fetchAllFilteredByAcademicYearAndExamTitleAndGrade(academicYearId, examTitleId, gradeId).subscribe(data => {
          if(data.length == 0) {
            this.toastrService.warning("There is no exam for this academic year, this exam title and this grade.", "Not Found");
          } else {
            this.studentCardService.generate(requestBody).subscribe({
              next: (res) => {
                let file = new Blob([res], { type: "application/x-zip-compressed" });
                let filename = 'student_card_' + format(new Date(), 'dd-MM-yyyy HH:mm:ss') + '.zip';
                saveAs(file, filename);
                this.toastrService.success("Successfully Generated.");
                this.studentCardService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.ASC, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade).subscribe({
                  next: (res: PaginationResponse) => {
                    if (this.currentPage > res.totalPages && res.totalPages != 0) {
                      this.currentPage = res.totalPages;
                      this.studentCardService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.ASC, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade).subscribe({
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
              },
              error: (err) => {
                showError(this.toastrService, this.router, err);
              }
            });
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
    if (this.form.invalid) {
      return;
    }

    this.valid = true;
    this.resetForm();
    this.studentCardService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.ASC, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
        this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  resetForm() {
    this.submitForm.reset();
    this.submittedForm = false;
  }

  reset() {
    this.form.reset();
    this.form.get('academicYear')!.setValue('');
    this.form.get('examTitle')!.setValue('');
    this.form.get('grade')!.setValue('');
    this.submitted = false;
    this.isCheckAll = false;
    this.currentPage = 1;
    this.idList = [];
    this.searchedExamTitle = 0;
    this.searchedAcademicYear = 0;
    this.searchedGrade = 0;
    this.valid = false;
    this.pageData = new PaginationResponse();
    this.sortedData = [];
    this.dataList = [];
  }

  enterPaginationEvent(currentPageEnterValue: number) {
    this.currentPage = currentPageEnterValue;

    this.studentCardService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.ASC, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade).subscribe({
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
