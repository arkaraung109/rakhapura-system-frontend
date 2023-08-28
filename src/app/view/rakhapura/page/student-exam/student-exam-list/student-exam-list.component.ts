import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { saveAs } from 'file-saver-es';
import { ToastrService } from 'ngx-toastr';
import { showError } from 'src/app/common/showError';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { CustomPaginationResponse } from 'src/app/model/CustomPaginationResponse';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { Grade } from 'src/app/model/Grade';
import { TableHeader } from 'src/app/model/TableHeader';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { GradeService } from 'src/app/service/grade.service';
import { PublicExamResultService } from 'src/app/service/public-exam-result.service';
import { StudentExamService } from 'src/app/service/student-exam.service';
import { UserService } from 'src/app/service/user.service';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';

@Component({
  selector: 'app-student-exam-list',
  templateUrl: './student-exam-list.component.html',
  styleUrls: ['./student-exam-list.component.css']
})
export class StudentExamListComponent implements OnInit {

  submitted = false;
  valid = false;
  pageData: CustomPaginationResponse = new CustomPaginationResponse();
  currentPage: number = 1;
  dataList: any[] = [];
  userInfo!: ApplicationUser;
  academicYearList!: AcademicYear[];
  examTitleList!: ExamTitle[];
  gradeList!: Grade[];
  examList: any[] = [];
  examSubjectList: any[] = [];
  givenMarkList: any[] = [];
  attendanceList: any[] = [];
  studentExamList: any[] = [];
  idList: string[] = [];
  totalPassMark: number = 0;
  totalMarkPercentage: number = 0;
  totalMark: number = 0;
  searchedAcademicYear: number = 0;
  searchedExamTitle: number = 0;
  searchedGrade: number = 0;
  keyword: string = "";
  totalAnswered: number = 0;
  totalPassed: number = 0;
  totalModerated: number = 0;
  totalFailed: number = 0;
  tableHeader: TableHeader = new TableHeader();
  alreadyPublished = false;

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
    keyword: new FormControl('', [
      whiteSpaceValidator()
    ])
  });

  constructor(
    private academicYearService: AcademicYearService,
    private examTitleService: ExamTitleService,
    private gradeService: GradeService,
    private studentExamService: StudentExamService,
    private publicExamResultService: PublicExamResultService,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.academicYearService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.academicYearList = data;
    });
    this.examTitleService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.examTitleList = data;
    });
    this.gradeService.fetchAllByAuthorizedStatus().subscribe(data => {
      this.gradeList = data;
    });

    this.userInfo = this.userService.fetchUserProfileInfo();
  }

  search() {
    this.submitted = true;
    this.currentPage = 1;
    this.searchedAcademicYear = this.form.get('academicYear')!.value;
    this.searchedExamTitle = this.form.get('examTitle')!.value;
    this.searchedGrade = this.form.get('grade')!.value;
    this.keyword = this.form.get('keyword')!.value.trim();
    if (this.form.invalid) {
      return;
    }

    this.valid = true;
    this.studentExamService.fetchPageSegmentBySearching(this.currentPage, this.searchedAcademicYear, this.searchedExamTitle, this.searchedGrade, this.keyword).subscribe({
      next: (res: CustomPaginationResponse) => {
        this.setDataInCurrentPage(res);
        this.totalAnswered = res.totalAnswered;
        this.totalPassed = res.totalPassed;
        this.totalModerated = res.totalModerated;
        this.totalFailed = res.totalFailed;
        this.tableHeader = res.tableHeader;

        if (res.elements.length != 0) {
          this.alreadyPublished = res.elements[0].attendance.exam.published;
        }
        for (let i = 0; i < res.elements.length; i++) {
          if (res.elements[i].status != 'fail') {
            this.idList[i] = res.elements[i].attendance.studentClass.id;
          }
        }
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  enterPaginationEvent(currentPageEnterValue: number) {
    this.currentPage = currentPageEnterValue;

    this.studentExamService.fetchPageSegmentBySearching(this.currentPage, this.searchedAcademicYear, this.searchedExamTitle, this.searchedGrade, this.keyword).subscribe({
      next: (res: CustomPaginationResponse) => {
        this.setDataInCurrentPage(res);
      },
      error: (err) => {
        showError(this.toastrService, this.router, err);
      }
    });
  }

  reset() {
    this.form.reset();
    this.form.get('academicYear')!.setValue('');
    this.form.get('examTitle')!.setValue('');
    this.form.get('grade')!.setValue('');
    this.form.get('keyword')!.setValue("");
    this.submitted = false;
    this.currentPage = 1;
    this.searchedAcademicYear = 0;
    this.searchedExamTitle = 0;
    this.searchedGrade = 0;
    this.keyword = "";
    this.valid = false;
    this.pageData = new CustomPaginationResponse();
    this.dataList = [];
    this.examList = [];
    this.examSubjectList = [];
    this.givenMarkList = [];
    this.attendanceList = [];
    this.studentExamList = [];
    this.idList = [];
    this.totalPassMark = 0;
    this.totalMarkPercentage = 0;
    this.totalMark = 0;
    this.totalAnswered = 0;
    this.totalPassed = 0;
    this.totalModerated = 0;
    this.totalFailed = 0;
    this.tableHeader = new TableHeader();
    this.alreadyPublished = false;
  }

  exportToExcel() {
    if (this.dataList.length == 0) {
      this.toastrService.warning("There is no record to export.", "Not Found");
    } else {
      this.studentExamService.exportToExcel(this.searchedAcademicYear, this.searchedExamTitle, this.searchedGrade, this.keyword).subscribe({
        next: (response) => {
          let file = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          let filename = 'student_exam_' + format(new Date(), 'dd-MM-yyyy HH:mm:ss') + '.xlsx';
          saveAs(file, filename);
          this.toastrService.success("Successfully Exported.");
        },
        error: (err) => {
          showError(this.toastrService, this.router, err);
        }
      });
    }
  }

  publishResults() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.alreadyPublished) {
          this.toastrService.warning("You cannot publish these results anymore.", "Already Published");
        } else {
          let academicYearId = this.form.get('academicYear')!.value;
          let examTitleId = this.form.get('examTitle')!.value;
          let gradeId = this.form.get('grade')!.value;
          this.publicExamResultService.publishResult(academicYearId, examTitleId, gradeId, this.idList).subscribe({
            next: (res: ApiResponse) => {
              if (res.status == HttpStatusCode.Created) {
                this.toastrService.success("Successfully Published.");
              }
            },
            error: (err) => {
              showError(this.toastrService, this.router, err);
            }
          });
        }
      } else {
        this.matDialog.closeAll();
      }
    });
  }

  setDataInCurrentPage(res: CustomPaginationResponse) {
    if (res.totalElements == 0) { this.currentPage = 0 }
    this.pageData = res;
    let pageSize = res.pageSize;
    let i = (this.currentPage - 1) * pageSize;
    this.dataList = this.pageData.elements.map(data => {
      let obj = { 'index': ++i, ...data };
      return obj;
    });
  }

}
