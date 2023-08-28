import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { RegionService } from 'src/app/service/region.service';
import { StudentService } from 'src/app/service/student.service';
import { UserService } from 'src/app/service/user.service';
import { saveAs } from 'file-saver-es';
import { format } from 'date-fns';
import { PaginationOrder } from 'src/app/common/PaginationOrder';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { Region } from 'src/app/model/Region';
import { showError } from 'src/app/common/showError';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  pageData: PaginationResponse = new PaginationResponse();
  currentPage: number = 1;
  userInfo!: ApplicationUser;
  sortedData: any[] = [];
  dataList: any[] = [];
  submitted = false;
  @ViewChild(MatSort) sort!: MatSort;
  regionList!: Region[];
  searchedRegion: number = 0;
  keyword: string = "";

  form: FormGroup = new FormGroup({
    region: new FormControl(0),
    keyword: new FormControl('', [
      whiteSpaceValidator()
    ])
  });

  constructor(
    private regionService: RegionService,
    private studentService: StudentService,
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
      this.searchedRegion = params['searchedRegion'] == undefined ? 0 : params['searchedRegion'];
      this.keyword = params['keyword'] == undefined ? '' : params['keyword'];
    });

    this.regionService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.regionList = data;
    });

    this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRegion, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });

    this.form.get('region')!.setValue(+this.searchedRegion);
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

  search() {
    this.submitted = true;
    this.currentPage = 1;
    this.searchedRegion = this.form.get('region')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if (this.form.invalid) {
      return;
    }

    this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRegion, this.keyword).subscribe({
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
    this.currentPage = 1;
    this.searchedRegion = 0;
    this.keyword = "";

    this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRegion, this.keyword).subscribe({
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

    this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRegion, this.keyword).subscribe({
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
    this.router.navigate(['/app/student/edit'], {
      queryParams: {
        id: id,
        currentPage: this.currentPage,
        searchedRegion: this.searchedRegion,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

  delete(id: string) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.delete(id).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Ok) {
              this.toastrService.success("Successfully Deleted.");
              this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRegion, this.keyword).subscribe({
                next: (res: PaginationResponse) => {
                  if (this.currentPage > res.totalPages && res.totalPages != 0) {
                    this.currentPage = res.totalPages;
                    this.studentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRegion, this.keyword).subscribe({
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
              this.toastrService.warning("Please delete student from assigned class first.", "Already Assigned in Class");
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

  viewDetails(id: string) {
    this.router.navigate(['/app/student/detail'], {
      queryParams: {
        id: id,
        currentPage: this.currentPage,
        searchedRegion: this.searchedRegion,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

  exportToExcel() {
    if (this.sortedData.length == 0) {
      this.toastrService.warning("There is no record to export.", "Not Found");
    } else {
      this.studentService.exportToExcel(this.searchedRegion, this.keyword).subscribe({
        next: (response) => {
          let file = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          let filename = 'student_' + format(new Date(), 'dd-MM-yyyy HH:mm:ss') + '.xlsx';
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
