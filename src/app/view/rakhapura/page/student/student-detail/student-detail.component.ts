import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/model/Student';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {

  id!: string;
  currentPage!: number;
  searchedRegion!: number;
  keyword!: string;

  student: Student = new Student();

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.currentPage = params['currentPage'];
      this.searchedRegion = params['searchedRegion'];
      this.keyword = params['keyword'];
    });
    this.studentService.fetchById(this.id).subscribe(data => {
      this.student.regDate = data.regDate;
      this.student.name = data.name;
      this.student.dob = data.dob;
      this.student.sex = data.sex;
      this.student.nationality = data.nationality;
      this.student.nrc = data.nrc;
      this.student.fatherName = data.fatherName;
      this.student.motherName = data.motherName;
      this.student.address = data.address;
      this.student.region.name = data.region.name;
      this.student.monasteryName = data.monasteryName;
      this.student.monasteryHeadmaster = data.monasteryHeadmaster;
      this.student.monasteryTownship = data.monasteryTownship;
    });
  }

  back() {
    this.router.navigate(['app/student/list'], {
      queryParams: {
        currentPage: this.currentPage,
        searchedRegion: this.searchedRegion,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
