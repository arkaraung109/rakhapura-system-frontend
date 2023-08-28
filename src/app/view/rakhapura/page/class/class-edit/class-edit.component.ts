import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Class } from 'src/app/model/Class';
import { Grade } from 'src/app/model/Grade';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ClassService } from 'src/app/service/class.service';
import { GradeService } from 'src/app/service/grade.service';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-class-edit',
  templateUrl: './class-edit.component.html',
  styleUrls: ['./class-edit.component.css']
})
export class ClassEditComponent implements OnInit {

  submitted = false;
  academicYearList!: AcademicYear[];
  gradeList!: Grade[];
  id!: number;
  currentPage!: number;
  searchedAcademicYear!: number;
  searchedGrade!: number;
  keyword!: string;
  oldClass: Class = new Class();

  form: FormGroup = new FormGroup({
    academicYear: new FormControl('', [
      Validators.required
    ]),
    grade: new FormControl('', [
      Validators.required
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ])
  });

  constructor(
    private academicYearService: AcademicYearService,
    private gradeService: GradeService,
    private classService: ClassService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.currentPage = params['currentPage'];
      this.searchedAcademicYear = params['searchedAcademicYear'];
      this.searchedGrade = params['searchedGrade'];
      this.keyword = params['keyword'];
    });

    this.academicYearService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.gradeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.gradeList = data;
    });

    this.classService.fetchById(this.id).subscribe(data => {
      this.form.get('academicYear')!.setValue(data.academicYear.id);
      this.form.get('grade')!.setValue(data.grade.id);
      this.form.get('name')!.setValue(data.name);
      this.oldClass = data;
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
        let requestBody: Class = new Class();
        requestBody.name = this.form.get('name')!.value.trim();
        requestBody.academicYear.id = this.form.get('academicYear')!.value;
        requestBody.grade.id = this.form.get('grade')!.value;

        this.classService.update(requestBody, this.id).subscribe({
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
    this.form.get('academicYear')!.setValue(this.oldClass.academicYear.id);
    this.form.get('grade')!.setValue(this.oldClass.grade.id);
    this.form.get('name')!.setValue(this.oldClass.name);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/class/list'], {
      queryParams: {
        currentPage: this.currentPage,
        searchedAcademicYear: this.searchedAcademicYear,
        searchedGrade: this.searchedGrade,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
