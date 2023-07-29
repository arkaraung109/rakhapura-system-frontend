import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { StudentClass } from 'src/app/model/StudentClass';
import { HttpErrorCode } from 'src/app/common/HttpErrorCode';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { StudentClassService } from 'src/app/service/student-class.service';
import { HttpCode } from 'src/app/common/HttpCode';
import { Hostel } from 'src/app/model/Hostel';
import { HostelService } from 'src/app/service/hostel.service';
import { StudentHostelService } from 'src/app/service/student-hostel.service';

@Component({
  selector: 'app-student-hostel-edit',
  templateUrl: './student-hostel-edit.component.html',
  styleUrls: ['./student-hostel-edit.component.css']
})
export class StudentHostelEditComponent implements OnInit {

  submitted = false;
  hostelList!: Hostel[];
  id!: string;
  currentPage!: number;
  searchedExamTitle!: number;
  searchedAcademicYear!: number;
  searchedGrade!: number;
  searchedHostel!: string;
  keyword!: string;
  oldStudentClass: StudentClass = new StudentClass();
  regNo!: string;
  studentName!: string;
  fatherName!: string;
  academicYear!: string;
  examTitle!: string;
  grade!: string;

  form: FormGroup = new FormGroup({
    hostel: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private hostelService: HostelService,
    private studentClassService: StudentClassService,
    private studentHostelService: StudentHostelService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.currentPage = params['currentPage'];
      this.searchedExamTitle = params['searchedExamTitle'];
      this.searchedAcademicYear = params['searchedAcademicYear'];
      this.searchedGrade = params['searchedGrade'];
      this.searchedHostel = params['searchedHostel'];
      this.keyword = params['keyword'];
    });

    this.hostelService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.hostelList = data;
    });

    this.studentClassService.fetchById(this.id).subscribe(data => {
      this.form.get('hostel')!.setValue(data.hostel.id);
      this.regNo = data.regNo;
      this.studentName = data.student.name;
      this.fatherName = data.student.fatherName;
      this.examTitle = data.examTitle.name;
      this.academicYear = data.studentClass.academicYear.name;
      this.grade = data.studentClass.grade.name;
      this.oldStudentClass.hostel = new Hostel();
      this.oldStudentClass.hostel.id = data.hostel.id;
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
        let requestBody: StudentClass = new StudentClass();
        requestBody.hostel = new Hostel();
        requestBody.hostel.id = this.form.get('hostel')!.value;

        this.studentHostelService.update(requestBody, this.id).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpCode.OK) {
              localStorage.setItem("status", "updated");
              this.back();
            }
          },
          error: (err) => {
            if (err.status == HttpErrorCode.FORBIDDEN) {
              this.toastrService.error("Forbidden", "Failed action");
            } else if (err.status == HttpErrorCode.NOT_ACCEPTABLE) {
              this.toastrService.error("Already Used For Student Card", "You cannot update this.");
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
    this.form.get('hostel')!.setValue(this.oldStudentClass.hostel.id);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/student-hostel/list'], {
      queryParams: {
        currentPage: this.currentPage,
        searchedExamTitle: this.searchedExamTitle,
        searchedAcademicYear: this.searchedAcademicYear,
        searchedGrade: this.searchedGrade,
        searchedHostel: this.searchedHostel,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
