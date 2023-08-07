import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Hostel } from 'src/app/model/Hostel';
import { HostelService } from 'src/app/service/hostel.service';
import { SaveAnotherDialogComponent } from 'src/app/save-another-dialog/save-another-dialog.component';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-hostel-create',
  templateUrl: './hostel-create.component.html',
  styleUrls: ['./hostel-create.component.css']
})
export class HostelCreateComponent {

  submitted = false;

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
      Validators.pattern("^(09-[0-9]{7,9})|(09\\s*[0-9]{7,9})|(\u1040\u1049-[\u1040-\u1049]{7,9})|(\u1040\u1049\\s*[\u1040-\u1049]{7,9})$"),
      whiteSpaceValidator()
    ])
  });

  constructor(
    private hostelService: HostelService,
    private toastrService: ToastrService,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  save() {
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

        this.hostelService.save(requestBody).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Created) {
              const dialogRef = this.matDialog.open(SaveAnotherDialogComponent, {
                width: '300px'
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.router.navigate(['/app/hostel/create']).then(() => {
                    this.reset();
                  });
                } else {
                  this.back();
                }
              });
              this.toastrService.success("Successfully Created.");
            }
          },
          error: (err) => {
            if(err.status == HttpStatusCode.Unauthorized) {
              localStorage.clear();
              this.router.navigate(['/error', HttpStatusCode.Unauthorized]);
            } else if (err.status == HttpStatusCode.Forbidden) {
              this.toastrService.error("This action is forbidden.", "Forbidden Access");
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
    this.form.reset();
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/hostel/list']);
  }

}
