import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { RegionService } from 'src/app/service/region.service';
import { StudentService } from 'src/app/service/student.service';
import { PaginationOrder } from 'src/app/common/PaginationOrder';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { Region } from 'src/app/model/Region';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { DataResponse } from 'src/app/model/DataResponse';
import { Router } from '@angular/router';
import { showError } from 'src/app/common/showError';
import { HttpStatusCode } from '@angular/common/http';
import { AwardService } from 'src/app/service/award.service';
import { Award } from 'src/app/model/Award';

@Component({
  selector: 'app-award-create',
  templateUrl: './award-create.component.html',
  styleUrls: ['./award-create.component.css']
})
export class AwardCreateComponent implements OnInit {

  pageData: PaginationResponse = new PaginationResponse();
  currentPage: number = 1;
  sortedData: any[] = [];
  dataList: any[] = [];
  submitted = false;
  submittedForm = false;
  isCheckAll = false;
  @ViewChild(MatSort) sort!: MatSort;
  regionList!: Region[];
  searchedRegion: number = 0;
  keyword: string = "";
  idList: string[] = [];

  submitForm: FormGroup = new FormGroup({
    award: new FormControl('', [
      Validators.required,
      Validators.maxLength(150),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    eventDate: new FormControl('', [
      Validators.required
    ])
  });

  form: FormGroup = new FormGroup({
    region: new FormControl(0),
    keyword: new FormControl('', [
      whiteSpaceValidator()
    ])
  });

  constructor(
    private awardService: AwardService,
    private regionService: RegionService,
    private studentService: StudentService,
    private toastrService: ToastrService,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.regionService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.regionList = data;
    });

    this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.ASC, this.searchedRegion, this.keyword).subscribe({
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
        let award = this.submitForm.get('award')!.value;
        let description = this.submitForm.get('description')!.value;
        let eventDate = this.submitForm.get('eventDate')!.value;

        let requestBody: Award = new Award();
        requestBody.award = award;
        requestBody.description = description;
        requestBody.eventDate = eventDate;
        this.awardService.save(requestBody, this.idList).subscribe({
          next: (res: DataResponse) => {
            if (res.status == HttpStatusCode.Created) {
              let size = res.createdCount;
              let message = "Successfully Created ";
              message += size > 1 ? size + " Records" : size + " Record";
              this.toastrService.success(message);
              this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.ASC, this.searchedRegion, this.keyword).subscribe({
                next: (res: PaginationResponse) => {
                  this.setDataInCurrentPage(res);
                  this.sort.sort({ id: 'id', start: 'desc', disableClear: false });
                  this.idList = [];
                  this.isCheckAll = false;
                  this.resetForm();
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
              this.toastrService.warning("You cannot save with this academic year, this exam title and this grade anymore.", "Already Published Exam Results");
            } else if (err.status == HttpStatusCode.Conflict) {
              if (err.error.createdCount != 0) {
                let size = err.error.createdCount;
                let message = "Successfully Created ";
                message += size > 1 ? size + " Records" : size + " Record";
                this.toastrService.success(message);
              }
              if (err.error.errorCount != 0) {
                let size = err.error.errorCount;
                let message = size > 1 ? size + " records already exist." : size + " record already exists.";
                this.toastrService.warning(message, "Duplication");
              }
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
    this.searchedRegion = this.form.get('region')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if (this.form.invalid) {
      return;
    }

    this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.ASC, this.searchedRegion, this.keyword).subscribe({
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
    this.form.get('region')!.setValue(0);
    this.form.get('keyword')!.setValue("");
    this.submitted = false;
    this.isCheckAll = false;
    this.currentPage = 1;
    this.idList = [];
    this.searchedRegion = 0;
    this.keyword = "";

    this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.ASC, this.searchedRegion, this.keyword).subscribe({
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

  enterPaginationEvent(currentPageEnterValue: number) {
    this.currentPage = currentPageEnterValue;

    this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.ASC, this.searchedRegion, this.keyword).subscribe({
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
