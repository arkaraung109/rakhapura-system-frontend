import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { saveAs } from 'file-saver-es';
import { ToastrService } from 'ngx-toastr';
import { PaginationOrder } from 'src/app/common/PaginationOrder';
import { showError } from 'src/app/common/showError';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { Grade } from 'src/app/model/Grade';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { StudentClass } from 'src/app/model/StudentClass';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ClassService } from 'src/app/service/class.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { GradeService } from 'src/app/service/grade.service';
import { StudentClassService } from 'src/app/service/student-class.service';
import { UserService } from 'src/app/service/user.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';

@Component({
  selector: 'app-student-class-list',
  templateUrl: './student-class-list.component.html',
  styleUrls: ['./student-class-list.component.css']
})
export class StudentClassListComponent implements OnInit {

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
    private studentClassService: StudentClassService,
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
      this.searchedExamTitle = params['searchedExamTitle'] == undefined ? 0 : params['searchedExamTitle'];
      this.searchedAcademicYear = params['searchedAcademicYear'] == undefined ? 0 : params['searchedAcademicYear'];
      this.searchedGrade = params['searchedGrade'] == undefined ? 0 : params['searchedGrade'];
      this.searchedClass = params['searchedClass'] == undefined ? 'All' : params['searchedClass'];
      this.keyword = params['keyword'] == undefined ? '' : params['keyword'];
    });

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

    this.studentClassService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });

    this.form.get('examTitle')!.setValue(+this.searchedExamTitle);
    this.form.get('academicYear')!.setValue(+this.searchedAcademicYear);
    this.form.get('grade')!.setValue(+this.searchedGrade);
    this.form.get('class')!.setValue(this.searchedClass);
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

    this.studentClassService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
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

    this.studentClassService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
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

    this.studentClassService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
        this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  edit(id: string) {
    this.studentClassService.fetchById(id).subscribe({
      next: (res: StudentClass) => {
        let isArrived = res.arrival;
        if (isArrived) {
          this.toastrService.warning("You cannot edit this.", "Already Arrived");
        } else {
          this.router.navigate(['/app/student-class/edit'], {
            queryParams: {
              id: id,
              currentPage: this.currentPage,
              searchedExamTitle: this.searchedExamTitle,
              searchedAcademicYear: this.searchedAcademicYear,
              searchedGrade: this.searchedGrade,
              searchedClass: this.searchedClass,
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
        this.studentClassService.delete(id).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Ok) {
              this.toastrService.success("Successfully Deleted.");
              this.studentClassService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
                next: (res: PaginationResponse) => {
                  if (this.currentPage > res.totalPages && res.totalPages != 0) {
                    this.currentPage = res.totalPages;
                    this.studentClassService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
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
            if (err.status == HttpStatusCode.Unauthorized) {
              localStorage.clear();
              this.router.navigate(['/error', HttpStatusCode.Unauthorized]);
            } else if (err.status == HttpStatusCode.Forbidden) {
              this.toastrService.error("This action is forbidden.", "Forbidden Access");
            } else if (err.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.warning("You cannot delete this.", "Already Arrived");
            } else if (err.status >= 400 && err.status < 500) {
              this.toastrService.error("Something went wrong.", "Client Error");
            } else if (err.status >= 500) {
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

  exportToExcel() {
    if (this.sortedData.length == 0) {
      this.toastrService.warning("There is no record to export.", "Not Found");
    } else {
      this.studentClassService.exportToExcel(this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
        next: (response) => {
          let file = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          let filename = 'student_class_' + format(new Date(), 'dd-MM-yyyy HH:mm:ss') + '.xlsx';
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
