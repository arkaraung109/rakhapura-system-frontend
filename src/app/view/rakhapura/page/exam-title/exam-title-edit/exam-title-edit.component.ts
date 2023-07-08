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
import { ExamTitle } from 'src/app/model/ExamTitle';
import { ExamTitleService } from 'src/app/service/exam-title.service';

@Component({
  selector: 'app-exam-title-edit',
  templateUrl: './exam-title-edit.component.html',
  styleUrls: ['./exam-title-edit.component.css']
})
export class ExamTitleEditComponent implements OnInit {

  submitted = false;
  id!: number;
  oldExamTitle: ExamTitle = new ExamTitle();

  form: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required, 
      Validators.maxLength(200), 
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ])
  });

  constructor(
    private examTitleService: ExamTitleService, 
    private toastrService: ToastrService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    this.examTitleService.fetchById(this.id).subscribe(data => {
      this.form.get('name')!.setValue(data.name);
      this.oldExamTitle.name = data.name;
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
        let requestBody: ExamTitle = new ExamTitle();
        requestBody.name = this.form.get('name')!.value.trim();
    
        this.examTitleService.update(requestBody, this.id).subscribe({
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
    this.form.get('name')!.setValue(this.oldExamTitle.name);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/exam-title/list']);
  }
  
}
