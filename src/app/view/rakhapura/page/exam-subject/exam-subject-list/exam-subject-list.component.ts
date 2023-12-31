import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpCode } from 'src/app/common/HttpCode';
import { HttpErrorCode } from 'src/app/common/HttpErrorCode';
import { PaginationOrder } from 'src/app/common/PaginationOrder';
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
  searchedAcademicYear!: number;
  searchedExamTitle!: number;
  searchedSubjectType!: number;
  searchedSubject!: number;
  keyword!: string;

  form: FormGroup = new FormGroup({
    academicYear: new FormControl(0),
    examTitle: new FormControl(0),
    subjectType: new FormControl(0),
    subject: new FormControl(0),
    keyword: new FormControl('', [
      Validators.pattern("^[^<>~`!{}|@^*=?%$\"\\\\]*$"),
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
    private router: Router, 
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
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

    this.examSubjectService.fetchPageSegment(this.currentPage).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        this.toastrService.error("Error message", "Something went wrong.");
      }
    });

    if(localStorage.getItem("status") === "updated") {
      this.toastrService.success("Successfully Updated.");
    } else if(localStorage.getItem("status") === "deleted") {
      this.toastrService.success("Successfully Deleted.");
    } else if(localStorage.getItem("status") === "authorized") {
      this.toastrService.success("Successfully Authorized.");
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
          return this.compare(a.exam.subjectType.name, b.exam.subjectType.name, isAsc);
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
    if(this.form.invalid) {
      return;
    }
    
    if(this.searchedAcademicYear == 0 && this.searchedExamTitle == 0 && this.searchedSubjectType == 0 && this.searchedSubject == 0 && this.keyword === '') {
      this.examSubjectService.fetchPageSegment(this.currentPage).subscribe({
        next: (res: PaginationResponse) => {
          this.setDataInCurrentPage(res);
          this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
    } else {
      this.examSubjectService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.searchedSubject, this.keyword).subscribe({
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

    if(!this.submitted || (this.searchedAcademicYear == 0 && this.searchedExamTitle == 0 && this.searchedSubjectType == 0 && this.searchedSubject == 0 && this.keyword === '')) {
      this.examSubjectService.fetchPageSegment(this.currentPage).subscribe({
        next: (res: PaginationResponse) => {
          this.setDataInCurrentPage(res);
          this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
    } else { 
      this.examSubjectService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.searchedSubject, this.keyword).subscribe({
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

  edit(id: number) {  
    this.examSubjectService.fetchById(id).subscribe({
      next: (res: ExamSubject) => {
        let isAuthorized = res.authorizedStatus;
        if(isAuthorized) {
          this.toastrService.error("Already Used", "You cannot edit this.");
        } else {
          this.router.navigate(['/app/exam-subject/edit'], {
            queryParams: {
                id: id
            },
            skipLocationChange: true
          });
        }
      },
      error: (err) => {
        this.toastrService.error("Error message", "Something went wrong.");
      }
    });
  }

  delete(id: string) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.examSubjectService.delete(id).subscribe({
          next: (res: ApiResponse) => {
            if(res.status == HttpCode.OK) {
              localStorage.setItem("status", "deleted");
              location.reload();
            }
          },
          error: (err) => {
            if(err.status == HttpErrorCode.NOT_ACCEPTABLE) {
              this.toastrService.error("Already Authorized", "You cannot delete this.");
            } else if(err.status == HttpErrorCode.FORBIDDEN) {
              this.toastrService.error("Forbidden", "Failed action");
            } else {
              this.toastrService.error("Failed to delete record", "Failed action");
            }
          }
        });
      } else {
        this.matDialog.closeAll();
      }
    });
  }

  authorize(id:number, authorizedUserId: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.examSubjectService.authorize(id, authorizedUserId).subscribe({
          next: (res: ApiResponse) => {
            if(res.status == HttpCode.OK) {
              localStorage.setItem("status", "authorized");
              location.reload();
            }
          },
          error: (err) => {
            this.toastrService.error("Error message", "Something went wrong.");
          }
        });
      } else {
        this.matDialog.closeAll();
      }
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
