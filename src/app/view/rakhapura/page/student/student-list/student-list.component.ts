import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpCode } from 'src/app/common/HttpCode';
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
import { HttpErrorCode } from 'src/app/common/HttpErrorCode';

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
  searchedRegion!: number;
  keyword!: string;

  form: FormGroup = new FormGroup({
    region: new FormControl(0),
    keyword: new FormControl('', [
      Validators.pattern("^[^<>~`!{}|@^*=?%$\"\\\\]*$"),
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
      this.currentPage = params['currentPage'] == undefined ? 1 : this.currentPage;
      this.searchedRegion = params['searchedRegion'];
      this.keyword = params['keyword'];
    });

    this.regionService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.regionList = data;
    });

    if(this.searchedRegion == undefined && this.keyword === undefined) {
      this.studentService.fetchPageSegment(this.currentPage).subscribe({
        next: (res: PaginationResponse) => {
          this.setDataInCurrentPage(res);
        },
        error: (err) => {
          this.toastrService.error("Error message", "Something went wrong.");
        }
      });
      this.searchedRegion = 0;
      this.keyword = '';
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
      this.form.get('region')!.setValue(+this.searchedRegion);
      this.form.get('keyword')!.setValue(this.keyword);
    }

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

  enterPaginationEvent(currentPageEnterValue: number) {
    this.currentPage = currentPageEnterValue;

    if(!this.submitted || (this.searchedRegion == 0 && this.keyword === '')) {
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

  edit(id: string) {  
    this.router.navigate(['/app/student/edit'], {
      queryParams: {
          id: id
      },
      skipLocationChange: true
    });
  }

  delete(id: string) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.studentService.delete(id).subscribe({
          next: (res: ApiResponse) => {
            if(res.status == HttpCode.OK) {
              localStorage.setItem("status", "deleted");
              location.reload();
            }
          },
          error: (err) => {
            if(err.status == HttpErrorCode.NOT_ACCEPTABLE) {
              this.toastrService.error("Please delete student from assigned class at first.", "Already Assigned in Class");
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
    this.studentService.exportToExcel().subscribe({
      next: (response) => {
        let file = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        let filename = 'student_' + format(new Date(), 'dd-MM-yyyy HH:mm:ss') + '.xlsx';
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
