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
import { HttpErrorCode } from 'src/app/common/HttpErrorCode';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { StudentClassService } from 'src/app/service/student-class.service';
import { HttpCode } from 'src/app/common/HttpCode';

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
    this.examTitleService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.examTitleList = data;
    });  
    this.academicYearSerivce.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.gradeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.gradeList = data;
    });
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    this.studentClassService.fetchById(this.id).subscribe(data => {
      this.form.get('examTitle')!.setValue(data.examTitle.id);
      this.form.get('academicYear')!.setValue(data.studentClass.academicYear.id);
      this.form.get('grade')!.setValue(data.studentClass.grade.id);
      this.studentId = data.student.id;
      this.studentName = data.student.name;
      this.fatherName = data.student.fatherName;
      this.oldStudentClass.examTitle.id = data.examTitle.id;
      this.oldStudentClass.studentClass.academicYear.id = data.studentClass.academicYear.id;
      this.oldStudentClass.studentClass.grade.id = data.studentClass.grade.id;
      this.oldStudentClass.studentClass.id = data.studentClass.id;
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
    if(academicYear == '' || grade == '') {
      this.classList = [];
      return;
    }
    this.classService.fetchAllFilteredByAcademicYearAndGrade(academicYear, grade).subscribe(data => {
      this.classList = data;
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
        let requestBody: StudentClass = new StudentClass();
        requestBody.examTitle.id = this.form.get('examTitle')!.value;
        requestBody.studentClass.academicYear.id = this.form.get('academicYear')!.value;
        requestBody.studentClass.id = this.form.get('class')!.value;
        requestBody.student.id = this.studentId;
    
        this.studentClassService.update(requestBody, this.id).subscribe({
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
              this.toastrService.error("Already Arrived", "You cannot update this.");
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
    this.form.get('examTitle')!.setValue(this.oldStudentClass.examTitle.id);
    this.form.get('academicYear')!.setValue(this.oldStudentClass.studentClass.academicYear.id);
    this.form.get('grade')!.setValue(this.oldStudentClass.studentClass.grade.id);
    this.classList = [...this.oldClassList];
    this.form.get('class')!.setValue(this.oldStudentClass.studentClass.id);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/student-class/list']);
  }

}
