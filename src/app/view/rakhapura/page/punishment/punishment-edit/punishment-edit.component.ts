import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { HttpStatusCode } from '@angular/common/http';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { format, parse } from 'date-fns';
import { PunishmentService } from 'src/app/service/punishment.service';
import { Punishment } from 'src/app/model/Punishment.';
import { dateComparisonValidator } from 'src/app/validator/date-comparison.validator';

@Component({
  selector: 'app-punishment-edit',
  templateUrl: './punishment-edit.component.html',
  styleUrls: ['./punishment-edit.component.css']
})
export class PunishmentEditComponent implements OnInit {

  submitted = false;
  id!: number;
  currentPage!: number;
  keyword!: string;
  studentId!: string;
  oldPunishment: Punishment = new Punishment();
  studentName!: string;
  fatherName!: string;

  form: FormGroup = new FormGroup({
    punishment: new FormControl('', [
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
    ]),
    startDate: new FormControl('', [
      Validators.required
    ]),
    endDate: new FormControl('', [
      Validators.required
    ])
  }, { validators: dateComparisonValidator('startDate', 'endDate') });

  constructor(
    private punishmentService: PunishmentService,
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

    this.punishmentService.fetchById(this.id).subscribe(data => {
      this.studentId = data.student.id;
      this.studentName = data.student.name;
      this.fatherName = data.student.fatherName;
      this.form.get('punishment')!.setValue(data.punishment);
      this.form.get('description')!.setValue(data.description);
      this.form.get('eventDate')!.setValue(format(parse(data.eventDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"));
      this.form.get('startDate')!.setValue(format(parse(data.startDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"));
      this.form.get('endDate')!.setValue(format(parse(data.endDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"));
      this.oldPunishment = data;
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
        let requestBody: Punishment = new Punishment();
        requestBody.punishment = this.form.get('punishment')!.value.trim();
        requestBody.description = this.form.get('description')!.value.trim();
        requestBody.eventDate = this.form.get('eventDate')!.value.trim();
        requestBody.startDate = this.form.get('startDate')!.value.trim();
        requestBody.endDate = this.form.get('endDate')!.value.trim();
        requestBody.student.id = this.studentId;

        this.punishmentService.update(requestBody, this.id).subscribe({
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
    this.form.get('punishment')!.setValue(this.oldPunishment.punishment);
    this.form.get('description')!.setValue(this.oldPunishment.description);
    this.form.get('eventDate')!.setValue(format(parse(this.oldPunishment.eventDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"));
    this.form.get('startDate')!.setValue(format(parse(this.oldPunishment.startDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"));
    this.form.get('endDate')!.setValue(format(parse(this.oldPunishment.endDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"));
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/punishment/list'], {
      queryParams: {
        currentPage: this.currentPage,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
