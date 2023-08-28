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
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { PunishmentService } from 'src/app/service/punishment.service';
import { UserService } from 'src/app/service/user.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { format } from 'date-fns';
import { saveAs } from 'file-saver-es';

@Component({
  selector: 'app-punishment-list',
  templateUrl: './punishment-list.component.html',
  styleUrls: ['./punishment-list.component.css']
})
export class PunishmentListComponent implements OnInit {

  pageData: PaginationResponse = new PaginationResponse();
  currentPage: number = 1;
  userInfo!: ApplicationUser;
  sortedData: any[] = [];
  dataList: any[] = [];
  submitted = false;
  @ViewChild(MatSort) sort!: MatSort;
  keyword: string = "";

  form: FormGroup = new FormGroup({
    keyword: new FormControl('', [
      whiteSpaceValidator()
    ])
  });

  constructor(
    private punishmentService: PunishmentService,
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
      this.keyword = params['keyword'] == undefined ? '' : params['keyword'];
    });

    this.punishmentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });

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
          return this.compare(a.student.name, b.student.name, isAsc);
        case 'fatherName':
          return this.compare(a.student.fatherName, b.student.fatherName, isAsc);
        case 'punishment':
          return this.compare(a.punishment, b.punishment, isAsc);
        case 'description':
          return this.compare(a.description, b.description, isAsc);
        case 'eventDate':
          return this.compare(a.eventDate, b.eventDate, isAsc);
        case 'startDate':
          return this.compare(a.startDate, b.startDate, isAsc);
        case 'endDate':
          return this.compare(a.endDate, b.endDate, isAsc);
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
    this.keyword = this.form.get('keyword')!.value.trim();
    if (this.form.invalid) {
      return;
    }

    this.punishmentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.keyword).subscribe({
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
    this.form.get('keyword')!.setValue("");
    this.submitted = false;
    this.currentPage = 1;
    this.keyword = "";

    this.punishmentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.keyword).subscribe({
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

    this.punishmentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.keyword).subscribe({
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
    this.router.navigate(['/app/punishment/edit'], {
      queryParams: {
        id: id,
        currentPage: this.currentPage,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

  delete(id: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.punishmentService.delete(id).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Ok) {
              this.toastrService.success("Successfully Deleted.");
              this.punishmentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.keyword).subscribe({
                next: (res: PaginationResponse) => {
                  if (this.currentPage > res.totalPages && res.totalPages != 0) {
                    this.currentPage = res.totalPages;
                    this.punishmentService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.keyword).subscribe({
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
            showError(this.toastrService, this.router, err);
          }
        });
      } else {
        this.matDialog.closeAll();
      }
    });
  }

  exportToExcel() {
    if(this.sortedData.length == 0) {
      this.toastrService.warning("There is no record to export.", "Not Found");
    } else {
      this.punishmentService.exportToExcel(this.keyword).subscribe({
        next: (response) => {
          let file = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          let filename = 'punished_student_' + format(new Date(), 'dd-MM-yyyy HH:mm:ss') + '.xlsx';
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
