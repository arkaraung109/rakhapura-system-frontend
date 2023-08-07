import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { SubjectType } from 'src/app/model/SubjectType';
import { SubjectService } from 'src/app/service/subject.service';
import { ExamSubject } from 'src/app/model/ExamSubject';
import { ExamSubjectService } from 'src/app/service/exam-subject.service';
import { ExamService } from 'src/app/service/exam.service';
import { lessThanValidator } from 'src/app/validator/less-than.validator';
import { Subject } from 'src/app/model/Subject';
import { SaveAnotherDialogComponent } from 'src/app/save-another-dialog/save-another-dialog.component';
import { showError } from 'src/app/common/showError';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-exam-subject-create',
  templateUrl: './exam-subject-create.component.html',
  styleUrls: ['./exam-subject-create.component.css']
})
export class ExamSubjectCreateComponent implements OnInit {

  submitted = false;
  academicYearList!: AcademicYear[];
  examTitleList!: ExamTitle[];
  subjectTypeList: SubjectType[] = [];
  subjectList: Subject[] = [];

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
    subject: new FormControl('', [
      Validators.required
    ]),
    passMark: new FormControl(''),
    markPercentage: new FormControl('')
  }, { validators: lessThanValidator });

  constructor(
    private examTitleService: ExamTitleService,
    private academicYearSerivce: AcademicYearService,
    private examService: ExamService,
    private subjectService: SubjectService,
    private examSubjectService: ExamSubjectService,
    private toastrService: ToastrService,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.academicYearSerivce.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.examTitleService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.examTitleList = data;
    });
    this.subjectService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.subjectList = data;
    });
  }

  change() {
    let academicYear = this.form.get('academicYear')!.value;
    let examTitle = this.form.get('examTitle')!.value;
    this.form.get('subjectType')!.setValue('');
    if (academicYear == '' || examTitle == '') {
      this.subjectTypeList = [];
      return;
    }
    this.examService.fetchAllFilteredByAcademicYearAndExamTitle(academicYear, examTitle).subscribe({
      next: (data) => {
        this.subjectTypeList = [];
        data.forEach(d => {
          this.subjectTypeList.push(d.subjectType);
        })
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
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
        let requestBody = new ExamSubject();
        requestBody.passMark = Number(this.form.get('passMark')!.value);
        requestBody.markPercentage = Number(this.form.get('markPercentage')!.value);
        requestBody.exam.academicYear.id = this.form.get('academicYear')!.value;
        requestBody.exam.examTitle.id = this.form.get('examTitle')!.value;
        requestBody.exam.subjectType.id = this.form.get('subjectType')!.value;
        requestBody.subject.id = this.form.get('subject')!.value;

        this.examSubjectService.save(requestBody).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Created) {
              const dialogRef = this.matDialog.open(SaveAnotherDialogComponent, {
                width: '300px'
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.router.navigate(['/app/exam-subject/create']).then(() => {
                    this.reset();
                  });
                }
                else {
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
              if (err.error.message === 'used object cannot be created.') {
                this.toastrService.warning("You cannot add anymore.", "Already Used For Mark Entry");
              } else {
                this.toastrService.warning("Record already exists.", "Duplication");
              }
            } else if (err.status == HttpStatusCode.NotAcceptable) {
              if (err.error.message === "passMarkExceeded") {
                this.toastrService.warning("Total sum of pass mark is exceeded.", "Exceeded");
              } else if (err.error.message === "markPercentageExceeded") {
                this.toastrService.warning("Total sum of mark percentage is exceeded.", "Exceeded");
              } else if (err.error.message === "passMarkExceeded&markPercentageExceeded") {
                this.toastrService.warning("Total sum of pass mark is exceeded.", "Exceeded");
                this.toastrService.warning("Total sum of mark percentage is exceeded.", "Exceeded");
              }
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
    this.form.get('academicYear')!.setValue('');
    this.form.get('examTitle')!.setValue('');
    this.form.get('subjectType')!.setValue('');
    this.form.get('subject')!.setValue('');
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/exam-subject/list']);
  }

}
