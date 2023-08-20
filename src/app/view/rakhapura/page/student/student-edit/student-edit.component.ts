import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { format, parse } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Region } from 'src/app/model/Region';
import { Student } from 'src/app/model/Student';
import { RegionService } from 'src/app/service/region.service';
import { StudentService } from 'src/app/service/student.service';
import { spaceValidator } from 'src/app/validator/space.validator';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit {

  submitted = false;
  regionList!: Region[];
  id!: string;
  currentPage!: number;
  searchedRegion!: number;
  keyword!: string;
  oldStudent: Student = new Student();

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
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.currentPage = params['currentPage'];
      this.searchedRegion = params['searchedRegion'];
      this.keyword = params['keyword'];
    });
    this.regionService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.regionList = data;
    });
    this.studentService.fetchById(this.id).subscribe(data => {
      this.form.get('name')!.setValue(data.name);
      this.form.get('dob')!.setValue(format(parse(data.dob, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"));
      this.form.get('sex')!.setValue(data.sex);
      this.form.get('nationality')!.setValue(data.nationality);
      this.form.get('nrc')!.setValue(data.nrc);
      this.form.get('fatherName')!.setValue(data.fatherName);
      this.form.get('motherName')!.setValue(data.motherName);
      this.form.get('address')!.setValue(data.address);
      this.form.get('region')!.setValue(data.region.id);
      this.form.get('monasteryName')!.setValue(data.monasteryName);
      this.form.get('monasteryHeadmaster')!.setValue(data.monasteryHeadmaster);
      this.form.get('monasteryTownship')!.setValue(data.monasteryTownship);
      this.oldStudent = data;
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

        this.studentService.update(requestBody, this.id).subscribe({
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
    this.form.get('name')!.setValue(this.oldStudent.name);
    this.form.get('dob')!.setValue(format(parse(this.oldStudent.dob, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"));
    this.form.get('sex')!.setValue(this.oldStudent.sex);
    this.form.get('nationality')!.setValue(this.oldStudent.nationality);
    this.form.get('nrc')!.setValue(this.oldStudent.nrc);
    this.form.get('fatherName')!.setValue(this.oldStudent.fatherName);
    this.form.get('motherName')!.setValue(this.oldStudent.motherName);
    this.form.get('address')!.setValue(this.oldStudent.address);
    this.form.get('region')!.setValue(this.oldStudent.region.id);
    this.form.get('monasteryName')!.setValue(this.oldStudent.monasteryName);
    this.form.get('monasteryHeadmaster')!.setValue(this.oldStudent.monasteryHeadmaster);
    this.form.get('monasteryTownship')!.setValue(this.oldStudent.monasteryTownship);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['app/student/list'], {
      queryParams: {
        currentPage: this.currentPage,
        searchedRegion: this.searchedRegion,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
