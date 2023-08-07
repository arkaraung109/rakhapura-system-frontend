import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { saveAs } from 'file-saver-es';
import { ToastrService } from 'ngx-toastr';
import { showError } from 'src/app/common/showError';
import { AcademicYear } from 'src/app/model/AcademicYear';
import { CustomPaginationResponse } from 'src/app/model/CustomPaginationResponse';
import { ExamTitle } from 'src/app/model/ExamTitle';
import { Grade } from 'src/app/model/Grade';
import { TableHeader } from 'src/app/model/TableHeader';
import { AcademicYearService } from 'src/app/service/academic-year.service';
import { ExamTitleService } from 'src/app/service/exam-title.service';
import { GradeService } from 'src/app/service/grade.service';
import { StudentExamService } from 'src/app/service/student-exam.service';
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
  academicYearList!: AcademicYear[];
  examTitleList!: ExamTitle[];
  gradeList!: Grade[];
  examList: any[] = [];
  examSubjectList: any[] = [];
  givenMarkList: any[] = [];
  attendanceList: any[] = [];
  studentExamList: any[] = [];
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
      Validators.pattern("^[^<>~`!{}|@^*=?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ])
  });

  constructor(
    private academicYearService: AcademicYearService,
    private examTitleService: ExamTitleService,
    private gradeService: GradeService,
    private studentExamService: StudentExamService,
    private toastrService: ToastrService,
    private router: Router
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
    location.reload();
  }

  exportToExcel() {
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
