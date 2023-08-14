import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Grade } from 'src/app/model/Grade';
import { SubjectType } from 'src/app/model/SubjectType';
import { GradeService } from 'src/app/service/grade.service';
import { SubjectTypeService } from 'src/app/service/subject-type.service';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-subject-type-edit',
  templateUrl: './subject-type-edit.component.html',
  styleUrls: ['./subject-type-edit.component.css']
})
export class SubjectTypeEditComponent implements OnInit {

  submitted = false;
  gradeList!: Grade[];
  id!: number;
  currentPage!: number;
  searchedGrade!: number;
  keyword!: string;
  oldSubjectType: SubjectType = new SubjectType();

  form: FormGroup = new FormGroup({
    grade: new FormControl('', [
      Validators.required
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(200),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ])
  });

  constructor(
    private gradeService: GradeService,
    private subjectTypeService: SubjectTypeService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.currentPage = params['currentPage'];
      this.searchedGrade = params['searchedGrade'];
      this.keyword = params['keyword'];
    });

    this.gradeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.gradeList = data;
    });

    this.subjectTypeService.fetchById(this.id).subscribe(data => {
      this.form.get('grade')!.setValue(data.grade.id);
      this.form.get('name')!.setValue(data.name);
      this.oldSubjectType = data;
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
        let requestBody: SubjectType = new SubjectType();
        requestBody.name = this.form.get('name')!.value.trim();
        requestBody.grade.id = this.form.get('grade')!.value;

        this.subjectTypeService.update(requestBody, this.id).subscribe({
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
    this.form.get('grade')!.setValue(this.oldSubjectType.grade.id);
    this.form.get('name')!.setValue(this.oldSubjectType.name);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/subject-type/list'], {
      queryParams: {
        currentPage: this.currentPage,
        searchedGrade: this.searchedGrade,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
