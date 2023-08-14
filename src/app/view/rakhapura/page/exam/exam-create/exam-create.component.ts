import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Exam } from 'src/app/model/Exam';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { SubjectType } from 'src/app/model/SubjectType';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { ExamService } from 'src/app/service/exam.service';
import { SubjectTypeService } from 'src/app/service/subject-type.service';
import { lessThanValidator } from 'src/app/validator/less-than.validator';
import { SaveAnotherDialogComponent } from 'src/app/save-another-dialog/save-another-dialog.component';
import { HttpStatusCode } from '@angular/common/http';
import { timeComparisonValidator } from 'src/app/validator/time-comparison.validator';

@Component({
  selector: 'app-exam-create',
  templateUrl: './exam-create.component.html',
  styleUrls: ['./exam-create.component.css']
})
export class ExamCreateComponent implements OnInit {

  submitted = false;
  academicYearList!: AcademicYear[];
  examTitleList!: ExamTitle[];
  subjectTypeList!: SubjectType[];

  form: FormGroup = new FormGroup({
    academicYear: new FormControl('', [
      Validators.required
    ]),
    examTitle: new FormControl('', [
      Validators.required
    ]),
    subjectType: new FormControl('', [
      Validators.required
    ]),
    examDate: new FormControl('', [
      Validators.required
    ]),
    startTime: new FormControl('', [
      Validators.required
    ]),
    endTime: new FormControl('', [
      Validators.required
    ]),
    passMark: new FormControl(''),
    markPercentage: new FormControl('')
  }, { validators: [lessThanValidator, timeComparisonValidator('startTime', 'endTime')] });

  constructor(
    private academicYearService: AcademicYearService,
    private examTitleService: ExamTitleService,
    private subjectTypeService: SubjectTypeService,
    private examService: ExamService,
    private toastrService: ToastrService,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.academicYearService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.examTitleService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.examTitleList = data;
    });
    this.subjectTypeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.subjectTypeList = data;
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
        let requestBody: Exam = new Exam();
        requestBody.examDate = this.form.get('examDate')!.value;
        requestBody.time = this.form.get('startTime')!.value + " - " + this.form.get('endTime')!.value;
        requestBody.passMark = this.form.get('passMark')!.value;
        requestBody.markPercentage = this.form.get('markPercentage')!.value;
        requestBody.academicYear.id = this.form.get('academicYear')!.value;
        requestBody.examTitle.id = this.form.get('examTitle')!.value;
        requestBody.subjectType.id = this.form.get('subjectType')!.value;

        this.examService.save(requestBody).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Created) {
              const dialogRef = this.matDialog.open(SaveAnotherDialogComponent, {
                width: '300px'
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.router.navigate(['/app/exam/create']).then(() => {
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
            if (err.status == HttpStatusCode.Unauthorized) {
              localStorage.clear();
              this.router.navigate(['/error', HttpStatusCode.Unauthorized]);
            } else if (err.status == HttpStatusCode.Forbidden) {
              this.toastrService.error("This action is forbidden.", "Forbidden Access");
            } else if (err.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.warning("You cannot save with this academic year, this exam title and this subject type anymore.", "Already Published Exam Results");
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
    this.form.reset();
    this.form.get('academicYear')!.setValue('');
    this.form.get('examTitle')!.setValue('');
    this.form.get('subjectType')!.setValue('');
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/exam/list']);
  }

}
