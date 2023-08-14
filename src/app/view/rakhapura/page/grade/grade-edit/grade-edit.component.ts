import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Grade } from 'src/app/model/Grade';
import { GradeService } from 'src/app/service/grade.service';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-grade-edit',
  templateUrl: './grade-edit.component.html',
  styleUrls: ['./grade-edit.component.css']
})
export class GradeEditComponent implements OnInit {

  submitted = false;
  id!: number;
  currentPage!: number;
  keyword!: string;
  oldGrade: Grade = new Grade();

  form: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    remark: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    abbreviate: new FormControl('', [
      Validators.required,
      Validators.maxLength(15),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ])
  });

  constructor(
    private gradeService: GradeService,
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
    this.gradeService.fetchById(this.id).subscribe(data => {
      this.form.get('name')!.setValue(data.name);
      this.form.get('remark')!.setValue(data.remark);
      this.form.get('abbreviate')!.setValue(data.abbreviate);
      this.oldGrade = data;
    });
  }

  update(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestBody: Grade = new Grade();
        requestBody.name = this.form.get('name')!.value.trim();
        requestBody.remark = this.form.get('remark')!.value.trim();
        requestBody.abbreviate = this.form.get('abbreviate')!.value.trim();

        this.gradeService.update(requestBody, this.id).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Ok) {
              localStorage.setItem("status", "updated");
              this.back();
            }
          },
          error: (err) => {
            if(err.status == HttpStatusCode.Unauthorized) {
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
            } else if(err.status >= 400 && err.status < 500) {
              this.toastrService.error("Something went wrong.", "Client Error");
            } else if(err.status >= 500) {
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
    this.form.get('name')!.setValue(this.oldGrade.name);
    this.form.get('remark')!.setValue(this.oldGrade.remark);
    this.form.get('abbreviate')!.setValue(this.oldGrade.abbreviate);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/grade/list'], {
      queryParams: {
        currentPage: this.currentPage,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
