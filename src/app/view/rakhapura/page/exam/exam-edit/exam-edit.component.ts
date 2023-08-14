import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { format, parse } from 'date-fns';
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
import { timeComparisonValidator } from 'src/app/validator/time-comparison.validator';

@Component({
  selector: 'app-exam-edit',
  templateUrl: './exam-edit.component.html',
  styleUrls: ['./exam-edit.component.css']
})
export class ExamEditComponent implements OnInit {

  submitted = false;
  academicYearList!: AcademicYear[];
  examTitleList!: ExamTitle[];
  subjectTypeList!: SubjectType[];
  id!: number;
  currentPage!: number;
  searchedAcademicYear!: number;
  searchedExamTitle!: number;
  searchedSubjectType!: number;
  keyword!: string;
  oldExam: Exam = new Exam();

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
    private academicYearSerivce: AcademicYearService,
    private examTitleService: ExamTitleService,
    private subjectTypeService: SubjectTypeService,
    private examService: ExamService,
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
      this.keyword = params['keyword'];
    });

    this.academicYearSerivce.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.examTitleService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.examTitleList = data;
    });
    this.subjectTypeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.subjectTypeList = data;
    });

    this.examService.fetchById(this.id).subscribe(data => {
      this.form.get('academicYear')!.setValue(data.academicYear.id);
      this.form.get('examTitle')!.setValue(data.examTitle.id);
      this.form.get('subjectType')!.setValue(data.subjectType.id);
      this.form.get('examDate')!.setValue(format(parse(data.examDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"));
      let time = data.time.split(" - ", 2);
      this.form.get('startTime')!.setValue(time[0]);
      this.form.get('endTime')!.setValue(time[1]);
      this.form.get('passMark')!.setValue(data.passMark);
      this.form.get('markPercentage')!.setValue(data.markPercentage);
      this.oldExam = data;
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
        let requestBody: Exam = new Exam();
        requestBody.examDate = this.form.get('examDate')!.value;
        requestBody.time = this.form.get('startTime')!.value + " - " + this.form.get('endTime')!.value;
        requestBody.passMark = this.form.get('passMark')!.value;
        requestBody.markPercentage = this.form.get('markPercentage')!.value;
        requestBody.academicYear.id = this.form.get('academicYear')!.value;
        requestBody.examTitle.id = this.form.get('examTitle')!.value;
        requestBody.subjectType.id = this.form.get('subjectType')!.value;

        this.examService.update(requestBody, this.id).subscribe({
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
            } else if (err.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.warning("You cannot update this.", "Already Authorized");
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
    this.form.get('academicYear')!.setValue(this.oldExam.academicYear.id);
    this.form.get('examTitle')!.setValue(this.oldExam.examTitle.id);
    this.form.get('subjectType')!.setValue(this.oldExam.subjectType.id);
    this.form.get('examDate')!.setValue(format(parse(this.oldExam.examDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"));
    let time = this.oldExam.time.split(" - ", 2);
    this.form.get('startTime')!.setValue(time[0]);
    this.form.get('endTime')!.setValue(time[1]);
    this.form.get('passMark')!.setValue(this.oldExam.passMark);
    this.form.get('markPercentage')!.setValue(this.oldExam.markPercentage);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/exam/list'], {
      queryParams: {
        currentPage: this.currentPage,
        searchedAcademicYear: this.searchedAcademicYear,
        searchedExamTitle: this.searchedExamTitle,
        searchedSubjectType: this.searchedSubjectType,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
