import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpCode } from 'src/app/common/HttpCode';
import { HttpErrorCode } from 'src/app/common/HttpErrorCode';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Hostel } from 'src/app/model/Hostel';
import { HostelService } from 'src/app/service/hostel.service';

@Component({
  selector: 'app-hostel-edit',
  templateUrl: './hostel-edit.component.html',
  styleUrls: ['./hostel-edit.component.css']
})
export class HostelEditComponent implements OnInit {

  submitted = false;
  id!: number;
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
    });
    this.hostelService.fetchById(this.id).subscribe(data => {
      this.form.get('name')!.setValue(data.name);
      this.form.get('address')!.setValue(data.address);
      this.form.get('phone')!.setValue(data.phone);
      this.oldHostel.name = data.name;
      this.oldHostel.address = data.address;
      this.oldHostel.phone = data.phone;
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
        let requestBody: Hostel = new Hostel();
        requestBody.name = this.form.get('name')!.value.trim();
        requestBody.address = this.form.get('address')!.value.trim();
        requestBody.phone = this.form.get('phone')!.value.trim();
    
        this.hostelService.update(requestBody, this.id).subscribe({
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
              this.toastrService.error("Already Authorized", "You cannot update this.");
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
    this.form.get('name')!.setValue(this.oldHostel.name);
    this.form.get('address')!.setValue(this.oldHostel.address);
    this.form.get('phone')!.setValue(this.oldHostel.phone);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/hostel/list']);
  }

}
