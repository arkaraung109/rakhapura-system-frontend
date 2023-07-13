import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { RegionService } from 'src/app/service/region.service';
import { StudentService } from 'src/app/service/student.service';
import { PaginationOrder } from 'src/app/common/PaginationOrder';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { Region } from 'src/app/model/Region';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { GradeService } from 'src/app/service/grade.service';
import { ClassService } from 'src/app/service/class.service';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { Grade } from 'src/app/model/Grade';
import { Class } from 'src/app/model/Class';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { StudentClass } from 'src/app/model/StudentClass';
import { HttpErrorCode } from 'src/app/common/HttpErrorCode';
import { StudentClassService } from 'src/app/service/student-class.service';
import { HttpCode } from 'src/app/common/HttpCode';
import { DataResponse } from 'src/app/model/DataResponse';

@Component({
  selector: 'app-student-class-create',
  templateUrl: './student-class-create.component.html',
  styleUrls: ['./student-class-create.component.css']
})
export class StudentClassCreateComponent implements OnInit {

  pageData: PaginationResponse = new PaginationResponse();
  currentPage: number = 1;
  sortedData: any[] = [];
  dataList: any[] = [];
  submitted = false;
  submittedForm = false;
  isCheckAll = false;
  @ViewChild(MatSort) sort!: MatSort;
  examTitleList!: ExamTitle[];
  academicYearList!: AcademicYear[];
  gradeList!: Grade[];
  classList!: Class[];
  regionList!: Region[];
  searchedRegion!: number;
  keyword!: string;
  idList: string[] = [];

  submitForm: FormGroup = new FormGroup({
    examTitle: new FormControl('', [
      Validators.required
    ]),
    academicYear: new FormControl('', [
      Validators.required
    ]),
    grade: new FormControl('', [
      Validators.required
    ]),
    class: new FormControl('', [
      Validators.required
    ])
  });

  form: FormGroup = new FormGroup({
    region: new FormControl(0),
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
    private regionService: RegionService,
    private studentService: StudentService, 
    private studentClassService: StudentClassService,
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
    this.regionService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.regionList = data;
    });

    this.studentService.fetchPageSegment(this.currentPage).subscribe({
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
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'fatherName':
          return this.compare(a.fatherName, b.fatherName, isAsc);
        case 'monasteryHeadmaster':
          return this.compare(a.monasteryHeadmaster, b.monasteryHeadmaster, isAsc);
        case 'monasteryName':
          return this.compare(a.monasteryName, b.monasteryName, isAsc);
        case 'region':
          return this.compare(a.region.name, b.region.name, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  change() {
    let academicYear = this.submitForm.get('academicYear')!.value;
    let grade = this.submitForm.get('grade')!.value;
    this.submitForm.get('class')!.setValue('');
    if(academicYear == '' || grade == '') {
      this.classList = [];
      return;
    }
    this.classService.fetchAllFilteredByAcademicYearAndGrade(academicYear, grade).subscribe(data => {
      this.classList = data;
    });
  }

  submit() {
    this.submittedForm = true;
    if(this.submitForm.invalid) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(this.idList.length == 0) {
          this.toastrService.warning("Please check students first.", "Not Finished Yet.");
          return;
        }
        let examTitleId = this.submitForm.get('examTitle')!.value;
        let academicYearId = this.submitForm.get('academicYear')!.value
        let classId = this.submitForm.get('class')!.value;

        let requestBody: StudentClass = new StudentClass();
        requestBody.examTitle.id = examTitleId;
        requestBody.studentClass.academicYear.id = academicYearId;
        requestBody.studentClass.id = classId;
        this.studentClassService.save(requestBody, this.idList).subscribe({
          next: (res: DataResponse) => {
            if(res.status == HttpCode.CREATED) {
              localStorage.setItem("status", "created");
              let size = res.createdCount;
              let message = "Successfully Created ";
              message += size > 1 ? size + " Records" : size + " Record";
              localStorage.setItem("message", message);
              this.router.navigate(['/app/student-class/create']).then(() => {
                location.reload();
              });
            }
          },
          error: (err) => {
            if(err.status == HttpErrorCode.CONFLICT) {
              if(err.error.createdCount != 0) {
                let size = err.error.createdCount;
                let message = "Successfully Created ";
                message += size > 1 ? size + " Records" : size + " Record";
                this.toastrService.success(message);
              }
              if(err.error.errorCount != 0) {
                let size = err.error.errorCount;
                let message = size > 1 ? size + " records already exist." : size + " record already exists.";
                this.toastrService.warning("Duplicate Record.", message);
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
    this.searchedRegion = this.form.get('region')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if(this.form.invalid) {
      return;
    }
    
    if(this.searchedRegion == 0 && this.keyword === '') {
      this.studentService.fetchPageSegment(this.currentPage).subscribe({
        next: (res: PaginationResponse) => {
          this.setDataInCurrentPage(res);
          this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
    } else {
      this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRegion, this.keyword).subscribe({
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

  resetForm() {
    this.submitForm.reset();
    this.submitForm.get('academicYear')!.setValue('');
    this.submitForm.get('examTitle')!.setValue('');
    this.submitForm.get('grade')!.setValue('');
    this.submitForm.get('class')!.setValue('');
    this.submittedForm = false;
  }

  enterPaginationEvent(currentPageEnterValue: number) {
    this.currentPage = currentPageEnterValue;

    if(!this.submitted || (this.searchedRegion == 0 && this.keyword === '')) {
      this.studentService.fetchPageSegment(this.currentPage).subscribe({
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
      this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRegion, this.keyword).subscribe({
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
