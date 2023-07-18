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
import { HttpErrorCode } from 'src/app/common/HttpErrorCode';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { HttpCode } from 'src/app/common/HttpCode';
import { SubjectType } from 'src/app/model/SubjectType';
import { SubjectService } from 'src/app/service/subject.service';
import { ExamSubject } from 'src/app/model/ExamSubject';
import { ExamSubjectService } from 'src/app/service/exam-subject.service';
import { ExamService } from 'src/app/service/exam.service';
import { lessThanValidator } from 'src/app/validator/less-than.validator';
import { Subject } from 'src/app/model/Subject';
import { SaveAnotherDialogComponent } from 'src/app/save-another-dialog/save-another-dialog.component';

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
    if(academicYear == '' || examTitle == '') {
      this.subjectTypeList = [];
      return;
    }
    this.examService.fetchAllFilteredByAcademicYearAndExamTitle(academicYear, examTitle).subscribe(data => {
      this.subjectTypeList = [];
      data.forEach(d => {
        this.subjectTypeList.push(d.subjectType);
      })
    });
  }

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
        let requestBody = new ExamSubject();
        requestBody.passMark = Number(this.form.get('passMark')!.value);
        requestBody.markPercentage = Number(this.form.get('markPercentage')!.value);
        requestBody.exam.academicYear.id = this.form.get('academicYear')!.value;
        requestBody.exam.examTitle.id = this.form.get('examTitle')!.value;
        requestBody.exam.subjectType.id = this.form.get('subjectType')!.value;
        requestBody.subject.id = this.form.get('subject')!.value;
      
        this.examSubjectService.save(requestBody).subscribe({
          next: (res: ApiResponse) => {
            if(res.status == HttpCode.CREATED) {
              const dialogRef = this.matDialog.open(SaveAnotherDialogComponent, {
                width: '300px'
              });
              dialogRef.afterClosed().subscribe(result => {
                if(result) {
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
            if(err.status == HttpErrorCode.NOT_ACCEPTABLE) {
              if(err.error.message === "passMarkExceeded") {
                this.toastrService.warning("Exceeded record.", "Total sum of pass mark is exceeded");
              } else if(err.error.message === "markPercentageExceeded") {
                this.toastrService.warning("Exceeded record.", "Total sum of mark percentage is exceeded");
              } else if(err.error.message === "passMarkExceeded&markPercentageExceeded") {
                this.toastrService.warning("Exceeded record.", "Total sum of pass mark is exceeded");
                this.toastrService.warning("Exceeded record.", "Total sum of mark percentage is exceeded");
              }
            } else if(err.status == HttpErrorCode.CONFLICT) {
              this.toastrService.warning("Duplicate record.", "Record already exists.");
            } else if(err.status == HttpErrorCode.FORBIDDEN) {
              this.toastrService.error("Forbidden", "Failed action");
            } else {
              this.toastrService.error("Failed to save new record", "Failed action");
            }
          }
        });

          // this.examSubjectService.fetchAllByExam(examId).subscribe(examSubjectList => {
          //   if(examSubjectList.length != 0) {
          //     examSubjectList.forEach(examSubject => {
          //       sumOfPassMark += examSubject.passMark;
          //       sumOfMarkPercentage += examSubject.markPercentage;
          //     });
          //   }
          //   if(sumOfPassMark > overAllPassMark) {
          //     this.toastrService.warning("Exceeded record.", "Total sum of pass mark is exceeded");
          //   }
          //   if(sumOfMarkPercentage > overAllMarkPercentage) {
          //     this.toastrService.warning("Exceeded record.", "Total sum of mark percentage is exceeded");
          //   }
          //   if(sumOfPassMark <= overAllPassMark && sumOfMarkPercentage <= overAllMarkPercentage) {
          //     let requestBody: ExamSubject = new ExamSubject();
          //     requestBody.exam.id = exam.id;
          //     requestBody.subject.id = subjectId;          
          //     requestBody.passMark = passMark;
          //     requestBody.markPercentage = markPercentage;
          //     this.examSubjectService.save(requestBody).subscribe({
          //       next: (res: ApiResponse) => {
          //         if(res.status == HttpCode.CREATED) {
          //           const dialogRef = this.matDialog.open(SaveAnotherDialogComponent, {
          //             width: '300px'
          //           });
          //           dialogRef.afterClosed().subscribe(result => {
          //             if(result) {
          //               this.router.navigate(['/app/exam-subject/create']).then(() => {
          //                 this.reset();
          //               });
          //             }
          //             else {
          //               this.back();
          //             }
          //           });
          //           this.toastrService.success("Successfully Created.");   
          //         }
          //       },
          //       error: (err) => {
          //         if(err.status == HttpErrorCode.CONFLICT) {
          //           this.toastrService.warning("Duplicate record.", "Record already exists.");
          //         } else if(err.status == HttpErrorCode.FORBIDDEN) {
          //           this.toastrService.error("Forbidden", "Failed action");
          //         } else {
          //           this.toastrService.error("Failed to save new record", "Failed action");
          //         }
          //       }
          //     });
          //   }
          // });
        //});
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
