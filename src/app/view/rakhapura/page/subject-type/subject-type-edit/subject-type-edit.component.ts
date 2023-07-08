import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpCode } from 'src/app/common/HttpCode';
import { HttpErrorCode } from 'src/app/common/HttpErrorCode';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Grade } from 'src/app/model/Grade';
import { SubjectType } from 'src/app/model/SubjectType';
import { GradeService } from 'src/app/service/grade.service';
import { SubjectTypeService } from 'src/app/service/subject-type.service';

@Component({
  selector: 'app-subject-type-edit',
  templateUrl: './subject-type-edit.component.html',
  styleUrls: ['./subject-type-edit.component.css']
})
export class SubjectTypeEditComponent implements OnInit {

  submitted = false;
  gradeList!: Grade[];
  id!: number;
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
    this.gradeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.gradeList = data;
    });
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    this.subjectTypeService.fetchById(this.id).subscribe(data => {
      this.form.get('grade')!.setValue(data.grade.id);
      this.form.get('name')!.setValue(data.name);
      this.oldSubjectType.grade.id = data.grade.id;
      this.oldSubjectType.name = data.name;
    });
  }

  update() {
    this.submitted = true;
    if(this.form.invalid) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        let requestBody: SubjectType = new SubjectType();
        requestBody.name = this.form.get('name')!.value.trim();
        requestBody.grade.id = this.form.get('grade')!.value;
    
        this.subjectTypeService.update(requestBody, this.id).subscribe({
          next: (res: ApiResponse) => {
            if(res.status == HttpCode.OK) {
              localStorage.setItem("status", "updated");
              this.back();
            }
          },
          error: (err) => {
            if(err.status == HttpErrorCode.CONFLICT) {
              this.toastrService.warning("Duplicate record.", "Record already exists.");
            } else if(err.status == HttpErrorCode.FORBIDDEN) {
              this.toastrService.error("Forbidden", "Failed action");
            } else if(err.status == HttpErrorCode.NOT_ACCEPTABLE) {
              this.toastrService.error("Already Authorized", "You cannot update this.");
            } else {
              this.toastrService.error("Failed to update new record", "Failed action");
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
    this.router.navigate(['/app/subject-type/list']);
  }

}
