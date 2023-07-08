import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpCode } from 'src/app/common/HttpCode';
import { HttpErrorCode } from 'src/app/common/HttpErrorCode';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { AcademicYearService } from 'src/app/service/academic-year.service';

@Component({
  selector: 'app-academic-year-edit',
  templateUrl: './academic-year-edit.component.html',
  styleUrls: ['./academic-year-edit.component.css']
})
export class AcademicYearEditComponent implements OnInit {

  submitted = false;
  id!: number;
  oldAcademicYear: AcademicYear = new AcademicYear();

  form: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required, 
      Validators.maxLength(30), 
      Validators.pattern("(^2[0-9]{3}-2[0-9]{3})|(\u1042[\u1040-\u1049]{3}-\u1042[\u1040-\u1049]{3})$"),
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
    });
    this.academicYearService.fetchById(this.id).subscribe(data => {
      this.form.get('name')!.setValue(data.name);
      this.oldAcademicYear.name = data.name;
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
      if(result) {
        let requestBody: AcademicYear = new AcademicYear();
        requestBody.name = this.form.get('name')!.value.trim();
    
        this.academicYearService.update(requestBody, this.id).subscribe({
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
    this.form.get('name')!.setValue(this.oldAcademicYear.name);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/academic-year/list']);
  }

}
