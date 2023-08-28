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
import { Class } from 'src/app/model/Class';
import { Grade } from 'src/app/model/Grade';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ClassService } from 'src/app/service/class.service';
import { GradeService } from 'src/app/service/grade.service';
import { UserService } from 'src/app/service/user.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.css']
})
export class ClassListComponent implements OnInit {

  pageData: PaginationResponse = new PaginationResponse();
  currentPage: number = 1;
  userInfo!: ApplicationUser;
  sortedData: any[] = [];
  dataList: any[] = [];
  submitted = false;
  @ViewChild(MatSort) sort!: MatSort;
  academicYearList!: AcademicYear[];
  gradeList!: Grade[];
  searchedAcademicYear: number = 0;
  searchedGrade: number = 0;
  keyword: string = "";

  form: FormGroup = new FormGroup({
    academicYear: new FormControl(0),
    grade: new FormControl(0),
    keyword: new FormControl('', [
      whiteSpaceValidator()
    ])
  });

  constructor(
    private academicYearService: AcademicYearService,
    private gradeService: GradeService,
    private classService: ClassService,
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
      this.searchedGrade = params['searchedGrade'] == undefined ? 0 : params['searchedGrade'];
      this.keyword = params['keyword'] == undefined ? '' : params['keyword'];
    });

    this.academicYearService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.gradeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.gradeList = data;
    });

    this.classService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedGrade, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });

    this.form.get('academicYear')!.setValue(+this.searchedAcademicYear);
    this.form.get('grade')!.setValue(+this.searchedGrade);
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
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'academicYear':
          return this.compare(a.academicYear.name, b.academicYear.name, isAsc);
        case 'grade':
          return this.compare(a.grade.name, b.grade.name, isAsc);
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
    this.searchedGrade = this.form.get('grade')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if (this.form.invalid) {
      return;
    }

    this.classService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedGrade, this.keyword).subscribe({
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

    this.classService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedGrade, this.keyword).subscribe({
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
    this.form.get('grade')!.setValue(0);
    this.form.get('keyword')!.setValue("");
    this.submitted = false;
    this.currentPage = 1;
    this.searchedAcademicYear = 0;
    this.searchedGrade = 0;
    this.keyword = "";

    this.classService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedGrade, this.keyword).subscribe({
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
    this.classService.fetchById(id).subscribe({
      next: (res: Class) => {
        let isAuthorized = res.authorizedStatus;
        if (isAuthorized) {
          this.toastrService.warning("You cannot edit this.", "Already Authorized");
        } else {
          this.router.navigate(['/app/class/edit'], {
            queryParams: {
              id: id,
              currentPage: this.currentPage,
              searchedAcademicYear: this.searchedAcademicYear,
              searchedGrade: this.searchedGrade,
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

  delete(id: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.classService.delete(id).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Ok) {
              this.toastrService.success("Successfully Deleted.");
              this.classService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedGrade, this.keyword).subscribe({
                next: (res: PaginationResponse) => {
                  if (this.currentPage > res.totalPages && res.totalPages != 0) {
                    this.currentPage = res.totalPages;
                    this.classService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedGrade, this.keyword).subscribe({
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
        this.classService.authorize(id, authorizedUserId).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Ok) {
              this.toastrService.success("Successfully Authorized.");
              this.classService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedGrade, this.keyword).subscribe({
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
