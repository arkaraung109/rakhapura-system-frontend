import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Hostel } from 'src/app/model/Hostel';
import { HostelService } from 'src/app/service/hostel.service';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-hostel-edit',
  templateUrl: './hostel-edit.component.html',
  styleUrls: ['./hostel-edit.component.css']
})
export class HostelEditComponent implements OnInit {

  submitted = false;
  id!: number;
  currentPage!: number;
  keyword!: string;
  oldHostel: Hostel = new Hostel();

  form: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern("^(09-[0-9]{7,9})|(09\\s*[0-9]{7,9})|(\\s*)|(\u1040\u1049-[\u1040-\u1049]{7,9})|(\u1040\u1049\\s*[\u1040-\u1049]{7,9})$"),
      whiteSpaceValidator()
    ])
  });

  constructor(
    private hostelService: HostelService,
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

    this.hostelService.fetchById(this.id).subscribe(data => {
      this.form.get('name')!.setValue(data.name);
      this.form.get('address')!.setValue(data.address);
      this.form.get('phone')!.setValue(data.phone);
      this.oldHostel = data;
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
        let requestBody: Hostel = new Hostel();
        requestBody.name = this.form.get('name')!.value.trim();
        requestBody.address = this.form.get('address')!.value.trim();
        requestBody.phone = this.form.get('phone')!.value.trim();

        this.hostelService.update(requestBody, this.id).subscribe({
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
              this.toastrService.warning("You cannot update this.", "Already Authorized");
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
    this.form.get('name')!.setValue(this.oldHostel.name);
    this.form.get('address')!.setValue(this.oldHostel.address);
    this.form.get('phone')!.setValue(this.oldHostel.phone);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/hostel/list'], {
      queryParams: {
        currentPage: this.currentPage,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
