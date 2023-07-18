import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ExamSubject } from 'src/app/model/ExamSubject';
import { lessThanValidator } from 'src/app/validator/less-than.validator';
import { ExamSubjectService } from 'src/app/service/exam-subject.service';
import { ExamService } from 'src/app/service/exam.service';
import { Subject } from 'src/app/model/Subject';
import { SubjectService } from 'src/app/service/subject.service';

@Component({
  selector: 'app-exam-subject-edit',
  templateUrl: './exam-subject-edit.component.html',
  styleUrls: ['./exam-subject-edit.component.css']
})
export class ExamSubjectEditComponent implements OnInit {

  submitted = false;
  academicYearList!: AcademicYear[];
  examTitleList!: ExamTitle[];
  subjectTypeList: SubjectType[] = [];
  subjectList: Subject[] = [];
  oldSubjectTypeList: SubjectType[] = [];
  id!: number;
  currentPage!: number;
  searchedAcademicYear!: number;
  searchedExamTitle!: number;
  searchedSubjectType!: number;
  searchedSubject!: number;
  keyword!: string;
  subjectId!: number;
  
  oldExamSubject: ExamSubject = new ExamSubject();

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
    private academicYearSerivce: AcademicYearService,
    private examTitleService: ExamTitleService,
    private examService: ExamService,
    private examSubjectService: ExamSubjectService,
    private subjectService: SubjectService,
    private toastrService: ToastrService,
    private route: ActivatedRoute, 
    private router: Router, 
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.currentPage = params['currentPage'];
      this.searchedAcademicYear = params['searchedAcademicYear'];
      this.searchedExamTitle = params['searchedExamTitle'];
      this.searchedSubjectType = params['searchedSubjectType'];
      this.searchedSubject = params['searchedSubject'];
      this.keyword = params['keyword'];
    });
    
    this.academicYearSerivce.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.examTitleService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.examTitleList = data;
    });  
    this.subjectService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.subjectList = data;
    });  

    this.examSubjectService.fetchById(this.id).subscribe(data => {
      this.form.get('academicYear')!.setValue(data.exam.academicYear.id);
      this.form.get('examTitle')!.setValue(data.exam.examTitle.id);
      this.form.get('subject')?.setValue(data.subject.id);
      this.form.get('passMark')!.setValue(data.passMark);
      this.form.get('markPercentage')!.setValue(data.markPercentage);
      this.oldExamSubject.exam.academicYear.id = data.exam.academicYear.id;
      this.oldExamSubject.exam.examTitle.id = data.exam.examTitle.id;
      this.oldExamSubject.exam.subjectType.id = data.exam.subjectType.id;
      this.oldExamSubject.subject.id = data.subject.id;
      this.oldExamSubject.passMark = data.passMark;
      this.oldExamSubject.markPercentage = data.markPercentage;
      this.form.get('subject')!.disable();
      this.examService.fetchAllFilteredByAcademicYearAndExamTitle(data.exam.academicYear.id, data.exam.examTitle.id).subscribe(data => {
        data.forEach(d => {
          this.subjectTypeList.push(d.subjectType);
          this.oldSubjectTypeList.push(d.subjectType);
        });
      });
      this.form.get('subjectType')!.setValue(data.exam.subjectType.id);
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
      });
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
        let academicYearId = this.form.get('academicYear')!.value;
        let examTitleId = this.form.get('examTitle')!.value;
        let subjectTypeId = this.form.get('subjectType')!.value;
        let subjectId = this.form.get('subject')!.value;
        let passMark = this.form.get('passMark')!.value;
        let markPercentage = this.form.get('markPercentage')!.value;
        
        this.examService.fetchFilteredByAcademicYearAndExamTitleAndSubjectType(academicYearId, examTitleId, subjectTypeId).subscribe(exam => {
          let examId = exam.id;
          let overAllPassMark = exam.passMark;
          let overAllMarkPercentage = exam.markPercentage;
          this.examSubjectService.fetchAllByExam(examId).subscribe(examSubjectList => {
            if(examSubjectList.length != 0) {
              examSubjectList.forEach(examSubject => {
                if(examSubject.id != this.id) {
                  passMark += examSubject.passMark;
                  markPercentage += examSubject.markPercentage;
                }
              });
            }
            if(passMark > overAllPassMark) {
              this.toastrService.warning("Exceeded record.", "Total sum of pass mark is exceeded");
            }
            if(markPercentage > overAllMarkPercentage) {
              this.toastrService.warning("Exceeded record.", "Total sum of mark percentage is exceeded");
            }
            if(passMark <= overAllPassMark && markPercentage <= overAllMarkPercentage) {
              let requestBody: ExamSubject = new ExamSubject();
              requestBody.subject.id = subjectId;          
              requestBody.exam.id = exam.id;
              requestBody.passMark = passMark;
              requestBody.markPercentage = markPercentage;
              this.examSubjectService.update(requestBody, this.id).subscribe({
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
            }
          });
        });
      } else {
        this.matDialog.closeAll();
      }
    });
  }

  reset() {
    this.form.get('academicYear')!.setValue(this.oldExamSubject.exam.academicYear.id);
    this.form.get('examTitle')!.setValue(this.oldExamSubject.exam.examTitle.id);
    this.subjectTypeList = [...this.oldSubjectTypeList];
    this.form.get('subjectType')!.setValue(this.oldExamSubject.exam.subjectType.id);
    this.form.get('subject')!.setValue(this.oldExamSubject.subject.id);
    this.form.get('passMark')!.setValue(this.oldExamSubject.passMark);
    this.form.get('markPercentage')!.setValue(this.oldExamSubject.markPercentage);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/exam-subject/list'], {
      queryParams: {
        currentPage: this.currentPage,
        searchedAcademicYear: this.searchedAcademicYear,
        searchedExamTitle: this.searchedExamTitle,
        searchedSubjectType: this.searchedSubjectType,
        searchedSubject: this.searchedSubject,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
