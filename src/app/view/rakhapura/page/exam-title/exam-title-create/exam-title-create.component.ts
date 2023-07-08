import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpCode } from 'src/app/common/HttpCode';
import { HttpErrorCode } from 'src/app/common/HttpErrorCode';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { SaveAnotherDialogComponent } from 'src/app/save-another-dialog/save-another-dialog.component';

@Component({
  selector: 'app-exam-title-create',
  templateUrl: './exam-title-create.component.html',
  styleUrls: ['./exam-title-create.component.css']
})
export class ExamTitleCreateComponent {

  submitted = false;

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
    private router: Router, 
    private matDialog: MatDialog
  ) { }

  save() {
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
    
        this.examTitleService.save(requestBody).subscribe({
          next: (res: ApiResponse) => {
            if(res.status == HttpCode.CREATED) {
              const dialogRef = this.matDialog.open(SaveAnotherDialogComponent, {
                width: '300px'
              });
              dialogRef.afterClosed().subscribe(result => {
                if(result) {
                  this.router.navigate(['/app/exam-title/create']).then(() => {
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
            if(err.status == HttpErrorCode.CONFLICT) {
              this.toastrService.warning("Duplicate record.", "Record already exists.");
            } else if(err.status == HttpErrorCode.FORBIDDEN) {
              this.toastrService.error("Forbidden", "Failed action");
            } else {
              this.toastrService.error("Failed to save new record", "Failed action");
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
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/exam-title/list']);
  }
  
}
