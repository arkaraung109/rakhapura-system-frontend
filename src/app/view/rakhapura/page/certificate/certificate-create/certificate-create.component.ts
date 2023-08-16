import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { Grade } from 'src/app/model/Grade';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { GradeService } from 'src/app/service/grade.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { Certificate } from 'src/app/model/Certificate';
import { CertificateService } from 'src/app/service/certificate.service';
import { showError } from 'src/app/common/showError';
import { saveAs } from 'file-saver-es';
import { format } from 'date-fns';
import { ExamService } from 'src/app/service/exam.service';


@Component({
  selector: 'app-certificate-create',
  templateUrl: './certificate-create.component.html',
  styleUrls: ['./certificate-create.component.css']
})
export class CertificateCreateComponent implements OnInit {

  submitted = false;
  examTitleList!: ExamTitle[];
  academicYearList!: AcademicYear[];
  gradeList!: Grade[];

  form: FormGroup = new FormGroup({
    academicYear: new FormControl('', [
      Validators.required
    ]),
    examTitle: new FormControl('', [
      Validators.required
    ]),
    grade: new FormControl('', [
      Validators.required
    ]),
    tharthanarYear: new FormControl('', [
      Validators.required,
      Validators.pattern("(^[1-9][0-9]{0,3}$)|(^[၁-၉][၀-၉]{0,3}$)"),
      whiteSpaceValidator()
    ]),
    kawzarYear: new FormControl('', [
      Validators.required,
      Validators.pattern("(^[1-9][0-9]{0,3}$)|(^[၁-၉][၀-၉]{0,3}$)"),
      whiteSpaceValidator()
    ]),
    chrisYear: new FormControl('', [
      Validators.required,
      Validators.pattern("(^[1-9][0-9]{0,3}$)|(^[၁-၉][၀-၉]{0,3}$)"),
      whiteSpaceValidator()
    ]),
    examDate: new FormControl('', [
      Validators.required
    ]),
    examHoldingTimes: new FormControl('', [
      Validators.required,
      Validators.pattern("^([1-9]|[1-9][0-9]|1[0-9][0-9]|200)$"),
      whiteSpaceValidator()
    ]),
    releasedDate: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private examTitleService: ExamTitleService,
    private academicYearSerivce: AcademicYearService,
    private gradeService: GradeService,
    private examService: ExamService,
    private certificateService: CertificateService,
    private toastrService: ToastrService,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.examTitleService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.examTitleList = data;
    });
    this.academicYearSerivce.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.gradeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.gradeList = data;
    });

    if (localStorage.getItem("status") === "generated") {
      this.toastrService.success("Successfully Generated.");
    }

    localStorage.removeItem("status");
  }

  generate() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let academicYearId = this.form.get('academicYear')!.value;
        let examTitleId = this.form.get('examTitle')!.value;
        let gradeId = this.form.get('grade')!.value;
        let tharthanarYear = this.form.get('tharthanarYear')!.value;
        let kawzarYear = this.form.get('kawzarYear')!.value;
        let chrisYear = this.form.get('chrisYear')!.value;
        let examDate = this.form.get('examDate')!.value;
        let examHoldingTimes = this.form.get('examHoldingTimes')!.value;
        let releasedDate = this.form.get('releasedDate')!.value;
        let requestBody: Certificate = new Certificate();
        requestBody.academicYearId = academicYearId;
        requestBody.examTitleId = examTitleId;
        requestBody.gradeId = gradeId;
        requestBody.tharthanarYear = tharthanarYear;
        requestBody.kawzarYear = kawzarYear;
        requestBody.chrisYear = chrisYear;
        requestBody.examDate = examDate;
        requestBody.examHoldingTimes = examHoldingTimes;
        requestBody.releasedDate = releasedDate;

        this.examService.fetchAllFilteredByAcademicYearAndExamTitleAndGrade(academicYearId, examTitleId, gradeId).subscribe(data => {
          if (data.length == 0) {
            this.toastrService.warning("There is no exam for this academic year, this exam title and this grade.", "Not Found");
          } else {
            if(!data[0].published) {
              this.toastrService.warning("There is no published exam for this academic year, this exam title and this grade.", "Not Found");
            } else {
              this.certificateService.generate(requestBody).subscribe({
                next: (response) => {
                  let file = new Blob([response], { type: "application/x-zip-compressed" });
                  let filename = 'certificates_' + format(new Date(), 'dd-MM-yyyy HH:mm:ss') + '.zip';
                  saveAs(file, filename);
                  this.toastrService.success("Successfully Generated.");
                },
                error: (err) => {
                  showError(this.toastrService, this.router, err);
                }
              });
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

}
