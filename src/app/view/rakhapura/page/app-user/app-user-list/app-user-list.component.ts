import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { PaginationResponse } from 'src/app/model/PaginationResponse';
import { UserService } from 'src/app/service/user.service';
import { saveAs } from 'file-saver-es';
import { format } from 'date-fns';
import { PaginationOrder } from 'src/app/common/PaginationOrder';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { showError } from 'src/app/common/showError';
import { HttpStatusCode } from '@angular/common/http';
import { UserRole } from 'src/app/model/UserRole';
import { RoleService } from 'src/app/service/role.service';
import { UserPermission } from 'src/app/common/UserPermission';


@Component({
  selector: 'app-app-user-list',
  templateUrl: './app-user-list.component.html',
  styleUrls: ['./app-user-list.component.css']
})
export class AppUserListComponent implements OnInit {

  pageData: PaginationResponse = new PaginationResponse();
  currentPage: number = 1;
  sortedData: any[] = [];
  dataList: any[] = [];
  submitted = false;
  @ViewChild(MatSort) sort!: MatSort;
  roleList!: UserRole[];
  searchedRole: number = 0;
  keyword: string = "";

  form: FormGroup = new FormGroup({
    role: new FormControl(0),
    keyword: new FormControl('', [
      whiteSpaceValidator()
    ])
  });

  constructor(
    private roleService: RoleService,
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
      this.searchedRole = params['searchedRole'] == undefined ? 0 : params['searchedRole'];
      this.keyword = params['keyword'] == undefined ? '' : params['keyword'];
    });

    this.roleService.fetchAll().subscribe(data => {
      this.roleList = data;
    });

    this.userService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRole, this.keyword).subscribe({
      next: (res: PaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });

    this.form.get('role')!.setValue(+this.searchedRole);
    this.form.get('keyword')!.setValue(this.keyword);

    if (localStorage.getItem("status") === "updated") {
      this.toastrService.success("Successfully Updated.");
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
        case 'firstName':
          return this.compare(a.firstName, b.firstName, isAsc);
        case 'lastName':
          return this.compare(a.lastName, b.lastName, isAsc);
        case 'loginUserName':
          return this.compare(a.loginUserName, b.loginUserName, isAsc);
        case 'role':
          return this.compare(a.role.name, b.role.name, isAsc);
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
    this.searchedRole = this.form.get('role')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if (this.form.invalid) {
      return;
    }

    this.userService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRole, this.keyword).subscribe({
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
    this.form.get('role')!.setValue(0);
    this.form.get('keyword')!.setValue("");
    this.submitted = false;
    this.currentPage = 1;
    this.searchedRole = 0;
    this.keyword = "";
    this.userService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRole, this.keyword).subscribe({
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

    this.userService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRole, this.keyword).subscribe({
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
    this.userService.fetchById(id).subscribe({
      next: (res: ApplicationUser) => {
        let isActive = res.activeStatus;
        if (res.role.name === UserPermission.ADMIN) {
          this.toastrService.warning("You cannot edit other administrator account.", "Access Denied");
        } else {
          if (!isActive) {
            this.toastrService.warning("You cannot edit this.", "Account Disabled");
          } else {
            this.router.navigate(['/app/app-user/edit'], {
              queryParams: {
                id: id,
                currentPage: this.currentPage,
                searchedRole: this.searchedRole,
                keyword: this.keyword
              },
              skipLocationChange: true
            });
          }
        }
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  changeActiveStatus(id: number, activeStatus: boolean) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.changeActiveStatus(id, activeStatus).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Ok) {
              this.toastrService.success("Successfully Changed Account Status.");
              this.userService.fetchPageSegmentBySearching(this.currentPage, PaginationOrder.DESC, this.searchedRole, this.keyword).subscribe({
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

  exportToExcel() {
    if (this.sortedData.length == 0) {
      this.toastrService.warning("There is no record to export.", "Not Found");
    } else {
      this.userService.exportToExcel(this.searchedRole, this.keyword).subscribe({
        next: (response) => {
          let file = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          let filename = 'app_user_' + format(new Date(), 'dd-MM-yyyy HH:mm:ss') + '.xlsx';
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
