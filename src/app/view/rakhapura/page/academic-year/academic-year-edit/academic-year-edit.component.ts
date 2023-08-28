import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-academic-year-edit',
  templateUrl: './academic-year-edit.component.html',
  styleUrls: ['./academic-year-edit.component.css']
})
export class AcademicYearEditComponent implements OnInit {

  submitted = false;
  id!: number;
  currentPage!: number;
  keyword!: string;
  oldAcademicYear: AcademicYear = new AcademicYear();

  form: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern("(^2[0-9]{3}-2[0-9]{3})$"),
      whiteSpaceValidator()
    ])
  });

  constructor(
    private academicYearService: AcademicYearService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.currentPage = params['currentPage'];
      this.keyword = params['keyword'];
    });
    this.academicYearService.fetchById(this.id).subscribe(data => {
      this.form.get('name')!.setValue(data.name);
      this.oldAcademicYear = data;
    });
  }

  update() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestBody: AcademicYear = new AcademicYear();
        requestBody.name = this.form.get('name')!.value.trim();

        this.academicYearService.update(requestBody, this.id).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Ok) {
              localStorage.setItem("status", "updated");
              this.back();
            }
          },
          error: (err) => {
            if (err.status == HttpStatusCode.Unauthorized) {
              localStorage.clear();
              this.router.navigate(['/error', HttpStatusCode.Unauthorized]);
            } else if (err.status == HttpStatusCode.Forbidden) {
              this.toastrService.error("This action is forbidden.", "Forbidden Access");
            } else if (err.status == HttpStatusCode.NotFound) {
              this.toastrService.warning("Record does not exist.", "Not Found");
            } else if (err.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.warning("You cannot update this.", "Already Authorized");
            } else if (err.status == HttpStatusCode.Conflict) {
              this.toastrService.warning("Record already exists.", "Duplication");
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

  reset() {
    this.form.get('name')!.setValue(this.oldAcademicYear.name);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['app/academic-year/list'], {
      queryParams: {
        currentPage: this.currentPage,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
