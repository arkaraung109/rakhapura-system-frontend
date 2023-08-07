import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Region } from 'src/app/model/Region';
import { Student } from 'src/app/model/Student';
import { SaveAnotherDialogComponent } from 'src/app/save-another-dialog/save-another-dialog.component';
import { RegionService } from 'src/app/service/region.service';
import { StudentService } from 'src/app/service/student.service';
import { spaceValidator } from 'src/app/validator/space.validator';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';

@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent implements OnInit {

  submitted = false;
  regionList!: Region[];

  form: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    dob: new FormControl('', [
      Validators.required
    ]),
    sex: new FormControl('', [
      Validators.required
    ]),
    nationality: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    nrc: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;?%$\"\\\\]*$"),
      whiteSpaceValidator(),
      spaceValidator()
    ]),
    fatherName: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    motherName: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!{}|@^*=?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    region: new FormControl('', [
      Validators.required
    ]),
    monasteryName: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    monasteryHeadmaster: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    monasteryTownship: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ])
  });

  constructor(
    private regionService: RegionService,
    private studentService: StudentService,
    private toastrService: ToastrService,
    private router: Router,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.regionService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.regionList = data;
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
        let requestBody: Student = new Student();
        requestBody.name = this.form.get('name')!.value.trim();
        requestBody.dob = this.form.get('dob')!.value;
        requestBody.sex = this.form.get('sex')!.value;
        requestBody.nationality = this.form.get('nationality')!.value.trim();
        requestBody.nrc = this.form.get('nrc')!.value.trim();
        requestBody.fatherName = this.form.get('fatherName')!.value.trim();
        requestBody.motherName = this.form.get('motherName')!.value.trim();
        requestBody.address = this.form.get('address')!.value.trim();
        requestBody.region.id = this.form.get('region')!.value;
        requestBody.monasteryName = this.form.get('monasteryName')!.value.trim();
        requestBody.monasteryHeadmaster = this.form.get('monasteryHeadmaster')!.value.trim();
        requestBody.monasteryTownship = this.form.get('monasteryTownship')!.value.trim();

        this.studentService.save(requestBody).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Created) {
              const dialogRef = this.matDialog.open(SaveAnotherDialogComponent, {
                width: '300px'
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.router.navigate(['/app/student/create']).then(() => {
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
    this.form.get('region')!.setValue('');
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/student/list']);
  }

}
