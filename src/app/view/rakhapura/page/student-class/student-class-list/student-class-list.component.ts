import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { saveAs } from 'file-saver-es';
import { ToastrService } from 'ngx-toastr';
import { HttpCode } from 'src/app/common/HttpCode';
import { HttpErrorCode } from 'src/app/common/HttpErrorCode';
import { PaginationOrder } from 'src/app/common/PaginationOrder';
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
  searchedExamTitle!: number;
  searchedAcademicYear!: number;
  searchedGrade!: number;
  searchedClass!: string;
  keyword!: string;

  form: FormGroup = new FormGroup({
    examTitle: new FormControl(0),
    academicYear: new FormControl(0),
    grade: new FormControl(0),
    class: new FormControl('All'),
    keyword: new FormControl('', [
      Validators.pattern("^[^<>~`!{}|@^*=?%$\"\\\\]*$"),
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

    this.studentClassService.fetchPageSegment(this.currentPage).subscribe({
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
    if(this.form.invalid) {
      return;
    }
    
    if(this.searchedExamTitle == 0 && this.searchedAcademicYear == 0 && this.searchedGrade == 0 && this.searchedClass === 'All' && this.keyword === '') {
      this.studentClassService.fetchPageSegment(this.currentPage).subscribe({
        next: (res: PaginationResponse) => {
          this.setDataInCurrentPage(res);
          this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
    } else {
      this.studentClassService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
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

    if(!this.submitted || (this.searchedExamTitle == 0 && this.searchedAcademicYear == 0 && this.searchedGrade == 0 && this.searchedClass === 'All' && this.keyword === '')) {
      this.studentClassService.fetchPageSegment(this.currentPage).subscribe({
        next: (res: PaginationResponse) => {
          this.setDataInCurrentPage(res);
          this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
    } else { 
      this.studentClassService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedExamTitle, this.searchedAcademicYear, this.searchedGrade, this.searchedClass, this.keyword).subscribe({
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

  edit(id: string) {  
    this.studentClassService.fetchById(id).subscribe({
      next: (res: StudentClass) => {
        let isArrived = res.arrival;
        if(isArrived) {
          this.toastrService.error("Already Arrived", "You cannot edit this.");
        } else {
          this.router.navigate(['/app/student-class/edit'], {
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
        this.studentClassService.delete(id).subscribe({
          next: (res: ApiResponse) => {
            if(res.status == HttpCode.OK) {
              localStorage.setItem("status", "deleted");
              location.reload();
            }
          },
          error: (err) => {
            if(err.status == HttpErrorCode.NOT_ACCEPTABLE) {
              this.toastrService.error("Already Arrived", "You cannot delete this.");
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

  exportToExcel() {
    this.studentClassService.exportToExcel().subscribe({
      next: (response) => {
        let file = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        let filename = 'student_class_' + format(new Date(), 'dd-MM-yyyy HH:mm:ss') + '.xlsx';
        saveAs(file, filename);
        this.toastrService.success("Successfully Exported.");
      },
      error: (error) => {
        this.toastrService.error("Error message", "Something went wrong.");
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
