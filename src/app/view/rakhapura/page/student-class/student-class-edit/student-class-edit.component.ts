import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { GradeService } from 'src/app/service/grade.service';
import { ClassService } from 'src/app/service/class.service';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { Grade } from 'src/app/model/Grade';
import { Class } from 'src/app/model/Class';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { StudentClass } from 'src/app/model/StudentClass';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { StudentClassService } from 'src/app/service/student-class.service';
import { showError } from 'src/app/common/showError';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-student-class-edit',
  templateUrl: './student-class-edit.component.html',
  styleUrls: ['./student-class-edit.component.css']
})
export class StudentClassEditComponent implements OnInit {

  submitted = false;
  examTitleList!: ExamTitle[];
  academicYearList!: AcademicYear[];
  gradeList!: Grade[];
  classList!: Class[];
  oldClassList!: Class[];
  id!: string;
  currentPage!: number;
  searchedExamTitle!: number;
  searchedAcademicYear!: number;
  searchedGrade!: number;
  searchedClass!: string;
  keyword!: string;
  studentId!: string;
  oldStudentClass: StudentClass = new StudentClass();
  studentName!: string;
  fatherName!: string;

  form: FormGroup = new FormGroup({
    examTitle: new FormControl('', [
      Validators.required
    ]),
    academicYear: new FormControl('', [
      Validators.required
    ]),
    grade: new FormControl('', [
      Validators.required
    ]),
    class: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private examTitleService: ExamTitleService,
    private academicYearSerivce: AcademicYearService,
    private gradeService: GradeService,
    private classService: ClassService,
    private studentClassService: StudentClassService,
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
      this.searchedClass = params['searchedClass'];
      this.keyword = params['keyword'];
    });

    this.examTitleService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.examTitleList = data;
    });
    this.academicYearSerivce.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.gradeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.gradeList = data;
    });

    this.studentClassService.fetchById(this.id).subscribe(data => {
      this.form.get('examTitle')!.setValue(data.examTitle.id);
      this.form.get('academicYear')!.setValue(data.studentClass.academicYear.id);
      this.form.get('grade')!.setValue(data.studentClass.grade.id);
      this.studentId = data.student.id;
      this.studentName = data.student.name;
      this.fatherName = data.student.fatherName;
      this.oldStudentClass = data;
      this.classService.fetchAllFilteredByAcademicYearAndGrade(data.studentClass.academicYear.id, data.studentClass.grade.id).subscribe(data => {
        this.classList = data;
        this.oldClassList = data;
      });
      this.form.get('class')!.setValue(data.studentClass.id);
    });
  }

  change() {
    let academicYear = this.form.get('academicYear')!.value;
    let grade = this.form.get('grade')!.value;
    this.form.get('class')!.setValue('');
    if (academicYear == '' || grade == '') {
      this.classList = [];
      return;
    }
    this.classService.fetchAllFilteredByAcademicYearAndGrade(academicYear, grade).subscribe({
      next: (data) => {
        this.classList = data;
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
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
        requestBody.examTitle.id = this.form.get('examTitle')!.value;
        requestBody.studentClass.academicYear.id = this.form.get('academicYear')!.value;
        requestBody.studentClass.id = this.form.get('class')!.value;
        requestBody.student.id = this.studentId;

        this.studentClassService.update(requestBody, this.id).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Ok) {
              localStorage.setItem("status", "updated");
              this.back();
            }
          },
          error: (err) => {
            if(err.status == HttpStatusCode.Unauthorized) {
              localStorage.clear();
              this.router.navigate(['/error', HttpStatusCode.Unauthorized]);
            } else if (err.status == HttpStatusCode.Forbidden) {
              this.toastrService.error("This action is forbidden.", "Forbidden Access");
            } else if (err.status == HttpStatusCode.NotFound) {
              this.toastrService.warning("Record does not exist.", "Not Found");
            } else if (err.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.warning("You cannot update this.", "Already Arrived");
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
    this.form.get('examTitle')!.setValue(this.oldStudentClass.examTitle.id);
    this.form.get('academicYear')!.setValue(this.oldStudentClass.studentClass.academicYear.id);
    this.form.get('grade')!.setValue(this.oldStudentClass.studentClass.grade.id);
    this.classList = [...this.oldClassList];
    this.form.get('class')!.setValue(this.oldStudentClass.studentClass.id);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/student-class/list'], {
      queryParams: {
        currentPage: this.currentPage,
        searchedExamTitle: this.searchedExamTitle,
        searchedAcademicYear: this.searchedAcademicYear,
        searchedGrade: this.searchedGrade,
        searchedClass: this.searchedClass,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
