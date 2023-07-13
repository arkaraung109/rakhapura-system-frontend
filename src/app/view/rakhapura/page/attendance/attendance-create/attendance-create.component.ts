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
import { DataResponse } from 'src/app/model/DataResponse';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { Grade } from 'src/app/model/Grade';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { SubjectType } from 'src/app/model/SubjectType';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ArrivalService } from 'src/app/service/arrival.service';
import { AttendanceService } from 'src/app/service/attendance.service';
import { ClassService } from 'src/app/service/class.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { GradeService } from 'src/app/service/grade.service';
import { StudentClassService } from 'src/app/service/student-class.service';
import { SubjectTypeService } from 'src/app/service/subject-type.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';


@Component({
  selector: 'app-attendance-create',
  templateUrl: './attendance-create.component.html',
  styleUrls: ['./attendance-create.component.css']
})
export class AttendanceCreateComponent implements OnInit {

  pageData: PaginationResponse = new PaginationResponse();
  currentPage: number = 1;
  sortedData: any[] = [];
  dataList: any[] = [];
  submitted = false;
  isCheckAll = false;
  @ViewChild(MatSort) sort!: MatSort;
  examTitleList!: ExamTitle[];
  academicYearList!: AcademicYear[];
  subjectTypeList!: SubjectType[];
  searchedExamTitle!: number;
  searchedAcademicYear!: number;
  searchedSubjectType!: number;
  keyword!: string;
  idList: string[] = [];

  form: FormGroup = new FormGroup({
    examTitle: new FormControl(0),
    academicYear: new FormControl(0),
    subjectType: new FormControl(0),
    keyword: new FormControl('', [
      Validators.pattern("^[^<>~`!{}|@^*=?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ])
  });
  
  constructor(
    private examTitleService: ExamTitleService, 
    private academicYearSerivce: AcademicYearService,
    private subjectTypeService: SubjectTypeService,
    private attendanceService: AttendanceService,
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
    this.subjectTypeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.subjectTypeList = data;
    });

    this.attendanceService.fetchPageSegment(this.currentPage, PaginationOrder.DESC, false).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        this.toastrService.error("Error message", "Something went wrong.");
      }
    });

    if(localStorage.getItem("status") === "created") {
      this.toastrService.success(localStorage.getItem("message")!);
    }

    localStorage.removeItem("status");
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
        case 'academicYear':
          return this.compare(a.exam.academicYear.name, b.exam.academicYear.name, isAsc);
        case 'examTitle':
          return this.compare(a.exam.examTitle.name, b.exam.examTitle.name, isAsc);
        case 'subjectType':
          return this.compare(a.exam.subjectType.name + " (" + a.exam.subjectType.grade.name + ")", b.exam.subjectType.name + " (" + b.exam.subjectType.grade.name + ")", isAsc);
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
      if(result) {
        if(this.idList.length == 0) {
          this.toastrService.warning("Please check students first.", "Not Finished Yet.");
          return;
        }

        this.attendanceService.save(this.idList).subscribe({
            next: (res: DataResponse) => {
              if(res.status == HttpCode.CREATED) {
                localStorage.setItem("status", "created");
                let size = res.createdCount;
                let message = "Successfully Make As Present ";
                message += size > 1 ? size + " Records" : size + " Record";
                localStorage.setItem("message", message);
                this.router.navigate(['/app/attendance/create']).then(() => {
                  location.reload();
                });
              }
            },
            error: (err) => {
              if(err.status === HttpErrorCode.NOT_FOUND) {
                if(err.error.createdCount != 0) {
                  let size = err.error.createdCount;
                  let message = "Successfully Make As Present ";
                  message += size > 1 ? size + " Records" : size + " Record";
                  this.toastrService.success(message);
                }
                if(err.error.errorCount != 0) {
                  let size = err.error.errorCount;
                  let message = size > 1 ? size + " records do not exist." : size + " record does not exist.";
                  this.toastrService.warning("Not Found Record.", message);
                }
              } else if(err.status == HttpErrorCode.FORBIDDEN) {
                this.toastrService.error("Forbidden", "Failed action");
              } else {
                this.toastrService.error("Failed to save new record", "Failed action");
              }
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

    for(let i = 0; i < this.sortedData.length; i++) {
      this.sortedData[i].check = this.isCheckAll;
      for(let j = 0; j < this.idList.length; j++) {
        if(this.idList[j] == this.sortedData[i].id) {
          isExist = true;
          index = j;
          break;
        }
      }
      if(!isExist) {
        this.idList.push(this.sortedData[i].id);
      }
      if(!this.sortedData[i].check) {
        this.idList.splice(index, 1);
      } 
    }
  }

  isAllSelected(event: any, id: string) {
    this.isCheckAll = this.sortedData.every(function(item: any) {
      return item.check == true;
    });
    if(event.target.checked) {
      this.idList.push(id);
    } else {
      for(let i = 0; i < this.idList.length; i++) {
        if(this.idList[i] == id) {
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
    this.searchedSubjectType = this.form.get('subjectType')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if(this.form.invalid) {
      return;
    }
    
    if(this.searchedExamTitle == 0 && this.searchedAcademicYear == 0 && this.searchedSubjectType == 0 && this.keyword === '') {
      this.attendanceService.fetchPageSegment(this.currentPage, PaginationOrder.DESC, false).subscribe({
        next: (res: PaginationResponse) => {
          this.setDataInCurrentPage(res);
          this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
    } else {
      this.attendanceService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, false, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.keyword).subscribe({
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

    if(!this.submitted || (this.searchedExamTitle == 0 && this.searchedAcademicYear == 0 && this.searchedSubjectType == 0 && this.keyword === '')) {
      this.attendanceService.fetchPageSegment(this.currentPage, PaginationOrder.DESC, false).subscribe({
        next: (res: PaginationResponse) => {
          if(res.totalElements == 0) {this.currentPage = 0}
          this.pageData = res;
          let pageSize = res.pageSize;
          let i = (this.currentPage - 1) * pageSize;
          this.dataList = this.pageData.elements.map(data => {
            let obj = {'index': ++i, ...data};
            for(let j = 0; j < this.idList.length; j++) {
              if(data.id == this.idList[j]) {
                obj.check = true;
              }
            }
            return obj;
          });
          this.sortedData = [...this.dataList];
          this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
          this.isCheckAll = this.sortedData.every(function(item: any) {
            return item.check == true;
          });
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
    } else { 
      this.attendanceService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, false, this.searchedAcademicYear, this.searchedExamTitle, this.searchedSubjectType, this.keyword).subscribe({
        next: (res: PaginationResponse) => {
          if(res.totalElements == 0) {this.currentPage = 0}
          this.pageData = res;
          let pageSize = res.pageSize;
          let i = (this.currentPage - 1) * pageSize;
          this.dataList = this.pageData.elements.map(data => {
            let obj = {'index': ++i, ...data};
            for(let j = 0; j < this.idList.length; j++) {
              if(data.id == this.idList[j]) {
                obj.check = true;
              }
            }
            return obj;
          });
          this.sortedData = [...this.dataList];
          this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
          this.isCheckAll = this.sortedData.every(function(item: any) {
            return item.check == true;
          });
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
    }
  }

  setDataInCurrentPage(res: PaginationResponse) {
    if(res.totalElements == 0) {this.currentPage = 0}
    this.pageData = res;
    let pageSize = res.pageSize;
    let i = (this.currentPage - 1) * pageSize;
    this.dataList = this.pageData.elements.map(data => {
      let obj = {'index': ++i, 'check': false, ...data};
      return obj;
    });
    this.sortedData = [...this.dataList];
  }

}
