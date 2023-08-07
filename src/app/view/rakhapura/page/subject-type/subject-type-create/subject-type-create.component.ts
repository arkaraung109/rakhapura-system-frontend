import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Grade } from 'src/app/model/Grade';
import { SubjectType } from 'src/app/model/SubjectType';
import { GradeService } from 'src/app/service/grade.service';
import { SubjectTypeService } from 'src/app/service/subject-type.service';
import { SaveAnotherDialogComponent } from 'src/app/save-another-dialog/save-another-dialog.component';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-subject-type-create',
  templateUrl: './subject-type-create.component.html',
  styleUrls: ['./subject-type-create.component.css']
})
export class SubjectTypeCreateComponent implements OnInit {

  submitted = false;
  gradeList!: Grade[];

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
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.gradeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.gradeList = data;
    });
  }

  save() {
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

        this.subjectTypeService.save(requestBody).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Created) {
              const dialogRef = this.matDialog.open(SaveAnotherDialogComponent, {
                width: '300px'
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.router.navigate(['/app/subject-type/create']).then(() => {
                    this.reset();
                  });
                } else {
                  this.back();
                }
              });
              this.toastrService.success("Successfully Created.");
            }
          },
          error: (err) => {
            if(err.status == HttpStatusCode.Unauthorized) {
              localStorage.clear();
              this.router.navigate(['/error', HttpStatusCode.Unauthorized]);
            } else if (err.status == HttpStatusCode.Forbidden) {
              this.toastrService.error("This action is forbidden.", "Forbidden Access");
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
    this.form.reset();
    this.form.get('grade')!.setValue('');
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/subject-type/list']);
  }

}
