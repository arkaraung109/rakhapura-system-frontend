import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaginationOrder } from 'src/app/common/PaginationOrder';
import { showError } from 'src/app/common/showError';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { ExamSubject } from 'src/app/model/ExamSubject';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { Subject } from 'src/app/model/Subject';
import { SubjectType } from 'src/app/model/SubjectType';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ExamSubjectService } from 'src/app/service/exam-subject.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { SubjectTypeService } from 'src/app/service/subject-type.service';
import { SubjectService } from 'src/app/service/subject.service';
import { UserService } from 'src/app/service/user.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';

@Component({
  selector: 'app-exam-subject-list',
  templateUrl: './exam-subject-list.component.html',
  styleUrls: ['./exam-subject-list.component.css']
})
export class ExamSubjectListComponent implements OnInit {

  pageData: PaginationResponse = new PaginationResponse();
  currentPage: number = 1;
  userInfo!: ApplicationUser;
  sortedData: any[] = [];
  dataList: any[] = [];
  submitted = false;
  @ViewChild(MatSort) sort!: MatSort;
  academicYearList!: AcademicYear[];
  examTitleList!: ExamTitle[];
  subjectTypeList!: SubjectType[];
  subjectList!: Subject[];
  searchedAcademicYear: number = 0;
  searchedExamTitle: number = 0;
  searchedSubjectType: number = 0;
  searchedSubject: number = 0;
  keyword: string = "";

  form: FormGroup = new FormGroup({
    academicYear: new FormControl(0),
    examTitle: new FormControl(0),
    subjectType: new FormControl(0),
    subject: new FormControl(0),
    keyword: new FormControl('', [
      whiteSpaceValidator()
    ])
  });

  constructor(
    private academicYearSerivce: AcademicYearService,
    private examTitleService: ExamTitleService,
    private subjectTypeService: SubjectTypeService,
    private subjectService: SubjectService,
    private examSubjectService: ExamSubjectService,
    private userService: UserService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['currentPage'] != undefined && params['currentPage'] != 1) {
        this.currentPage = Number(params['currentPage']);
      }
      this.searchedAcademicYear = params['searchedAcademicYear'] == undefined ? 0 : params['searchedAcademicYear'];
      this.searchedExamTitle = params['searchedExamTitle'] == undefined ? 0 : params['searchedExamTitle'];
      this.searchedSubjectType = params['searchedSubjectType'] == undefined ? 0 : params['searchedSubjectType'];
      this.searchedSubject = params['searchedSubject'] == undefined ? 0 : params['searchedSubject'];
      this.keyword = params['keyword'] == undefined ? '' : params['keyword'];
    });

    this.academicYearSerivce.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.examTitleService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.examTitleList = data;
    });
    this.subjectTypeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.subjectTypeList = data;
    });
    this.subjectService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.subjectList = data;
    });

    this.examSubjectService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.searchedSubject, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });

    this.form.get('academicYear')!.setValue(+this.searchedAcademicYear);
    this.form.get('examTitle')!.setValue(+this.searchedExamTitle);
    this.form.get('subjectType')!.setValue(+this.searchedSubjectType);
    this.form.get('subject')!.setValue(+this.searchedSubject);
    this.form.get('keyword')!.setValue(this.keyword);

    if (localStorage.getItem("status") === "updated") {
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
        case 'academicYear':
          return this.compare(a.exam.academicYear.name, b.exam.academicYear.name, isAsc);
        case 'examTitle':
          return this.compare(a.exam.examTitle.name, b.exam.examTitle.name, isAsc);
        case 'grade':
          return this.compare(a.exam.subjectType.grade.name, b.exam.subjectType.grade.name, isAsc);
        case 'subjectType':
          return this.compare(a.exam.subjectType.name + " (" + a.exam.subjectType.grade.name + ")", b.exam.subjectType.name + " (" + b.exam.subjectType.grade.name + ")", isAsc);
        case 'subject':
          return this.compare(a.subject.name, b.subject.name, isAsc);
        case 'passMark':
          return this.compare(a.passMark, b.passMark, isAsc);
        case 'markPercentage':
          return this.compare(a.markPercentage, b.markPercentage, isAsc);
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
    this.searchedAcademicYear = this.form.get('academicYear')!.value;
    this.searchedExamTitle = this.form.get('examTitle')!.value;
    this.searchedSubjectType = this.form.get('subjectType')!.value;
    this.searchedSubject = this.form.get('subject')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if (this.form.invalid) {
      return;
    }

    this.examSubjectService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.searchedSubject, this.keyword).subscribe({
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
    this.form.get('academicYear')!.setValue(0);
    this.form.get('examTitle')!.setValue(0);
    this.form.get('subjectType')!.setValue(0);
    this.form.get('subject')!.setValue(0);
    this.form.get('keyword')!.setValue("");
    this.submitted = false;
    this.currentPage = 1;
    this.searchedAcademicYear = 0;
    this.searchedExamTitle = 0;
    this.searchedSubjectType = 0;
    this.searchedSubject = 0;
    this.keyword = "";

    this.examSubjectService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.searchedSubject, this.keyword).subscribe({
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

    this.examSubjectService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.searchedSubject, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
        this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  edit(id: number) {
    this.examSubjectService.fetchById(id).subscribe({
      next: (res: ExamSubject) => {
        let isAuthorized = res.authorizedStatus;
        if (isAuthorized) {
          this.toastrService.warning("You cannot edit this.", "Already Used For Mark Entry");
        } else {
          this.router.navigate(['/app/exam-subject/edit'], {
            queryParams: {
              id: id,
              currentPage: this.currentPage,
              searchedAcademicYear: this.searchedAcademicYear,
              searchedExamTitle: this.searchedExamTitle,
              searchedSubjectType: this.searchedSubjectType,
              searchedSubject: this.searchedSubject,
              keyword: this.keyword
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

  delete(id: string) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.examSubjectService.delete(id).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Ok) {
              this.toastrService.success("Successfully Deleted.");
              this.examSubjectService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.searchedSubject, this.keyword).subscribe({
                next: (res: PaginationResponse) => {
                  if (this.currentPage > res.totalPages && res.totalPages != 0) {
                    this.currentPage = res.totalPages;
                    this.examSubjectService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.searchedSubject, this.keyword).subscribe({
                      next: (response: PaginationResponse) => {
                        this.setDataInCurrentPage(response);
                        this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
                      },
                      error: (err) => {
                        showError(this.toastrService, this.router, err);
                      }
                    });
                  } else {
                    this.setDataInCurrentPage(res);
                    this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
                  }
                },
                error: (err) => {
                  showError(this.toastrService, this.router, err);
                }
              });
            }
          },
          error: (err) => {
            if(err.status == HttpStatusCode.Unauthorized) {
              localStorage.clear();
              this.router.navigate(['/error', HttpStatusCode.Unauthorized]);
            } else if (err.status == HttpStatusCode.Forbidden) {
              this.toastrService.error("This action is forbidden.", "Forbidden Access");
            } else if (err.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.warning("You cannot delete this.", "Already Authorized");
            } else if(err.status >= 400 && err.status < 500) {
              this.toastrService.error("Something went wrong.", "Client Error");
            } else if(err.status >= 500) {
              this.toastrService.error("Please contact administrator.", "Server Error");
            } else {
              this.toastrService.error("Something went wrong.", "Unknown Error");
            }
          }
        });
      } else {
        this.matDialog.closeAll();
      }
    });
  }

  authorize(id: number, authorizedUserId: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.examSubjectService.authorize(id, authorizedUserId).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Ok) {
              this.toastrService.success("Successfully Authorized.");
              this.examSubjectService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.searchedSubject, this.keyword).subscribe({
                next: (res: PaginationResponse) => {
                  this.setDataInCurrentPage(res);
                  this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
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
