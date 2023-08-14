import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { HttpStatusCode } from '@angular/common/http';
import { Award } from 'src/app/model/Award';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { AwardService } from 'src/app/service/award.service';
import { format, parse } from 'date-fns';

@Component({
  selector: 'app-award-edit',
  templateUrl: './award-edit.component.html',
  styleUrls: ['./award-edit.component.css']
})
export class AwardEditComponent implements OnInit {

  submitted = false;
  id!: number;
  currentPage!: number;
  keyword!: string;
  studentId!: string;
  oldAward: Award = new Award();
  studentName!: string;
  fatherName!: string;

  form: FormGroup = new FormGroup({
    award: new FormControl('', [
      Validators.required,
      Validators.maxLength(150),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    eventDate: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private awardService: AwardService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.currentPage = params['currentPage'];
      this.keyword = params['keyword'];
    });

    this.awardService.fetchById(this.id).subscribe(data => {
      this.studentId = data.student.id;
      this.studentName = data.student.name;
      this.fatherName = data.student.fatherName;
      this.form.get('award')!.setValue(data.award);
      this.form.get('description')!.setValue(data.description);
      this.form.get('eventDate')!.setValue(format(parse(data.eventDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"));
      this.oldAward = data;
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
        let requestBody: Award = new Award();
        requestBody.award = this.form.get('award')!.value.trim();
        requestBody.description = this.form.get('description')!.value.trim();
        requestBody.eventDate = this.form.get('eventDate')!.value.trim();
        requestBody.student.id = this.studentId;

        this.awardService.update(requestBody, this.id).subscribe({
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
    this.form.get('award')!.setValue(this.oldAward.award);
    this.form.get('description')!.setValue(this.oldAward.description);
    this.form.get('eventDate')!.setValue(format(parse(this.oldAward.eventDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"));
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/award/list'], {
      queryParams: {
        currentPage: this.currentPage,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
