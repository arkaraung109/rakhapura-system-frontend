import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { SaveAnotherDialogComponent } from 'src/app/save-another-dialog/save-another-dialog.component';
import { HttpStatusCode } from '@angular/common/http';
import { spaceValidator } from 'src/app/validator/space.validator';
import { confirmPasswordValidator } from 'src/app/validator/confirm-password.validator';
import { RoleService } from 'src/app/service/role.service';
import { UserService } from 'src/app/service/user.service';
import { UserRole } from 'src/app/model/UserRole';
import { ApplicationUser } from 'src/app/model/ApplicationUser';

@Component({
  selector: 'app-app-user-create',
  templateUrl: './app-user-create.component.html',
  styleUrls: ['./app-user-create.component.css']
})
export class AppUserCreateComponent implements OnInit {

  submitted = false;
  roleList!: UserRole[];

  form: FormGroup = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    loginUserName: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern("^[^<>~`!\\[\\]{}|@#^*+=:;/?%$\"\\\\]*$"),
      whiteSpaceValidator()
    ]),
    role: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern("^(?=.*[A-Z])(?=.*[`~^?()\\{\\}\\[\\]|;,:<>?\\\\/!@#$%&*\\-_+=])(?=.*[0-9])(?=.*[a-z]).{8,30}$"),
      whiteSpaceValidator(),
      spaceValidator()
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.pattern("^(?=.*[A-Z])(?=.*[`~^?()\\{\\}\\[\\]|;,:<>?\\\\/!@#$%&*\\-_+=])(?=.*[0-9])(?=.*[a-z]).{8,30}$"),
      whiteSpaceValidator(),
      spaceValidator()
    ]),
  }, { validators: confirmPasswordValidator('password', 'confirmPassword') });

  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.roleService.fetchAll().subscribe(data => {
      this.roleList = data;
    });
  }

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
        let requestBody: ApplicationUser = new ApplicationUser();
        requestBody.firstName = this.form.get('firstName')!.value.trim();
        requestBody.lastName = this.form.get('lastName')!.value.trim();
        requestBody.loginUserName = this.form.get('loginUserName')!.value.trim();
        requestBody.password = this.form.get('password')!.value.trim();
        requestBody.role.id = this.form.get('role')!.value;

        this.userService.save(requestBody).subscribe({
          next: (res: ApiResponse) => {
            if (res.status == HttpStatusCode.Created) {
              const dialogRef = this.matDialog.open(SaveAnotherDialogComponent, {
                width: '300px'
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.router.navigate(['/app/app-user/create']).then(() => {
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
            if (err.status == HttpStatusCode.Unauthorized) {
              localStorage.clear();
              this.router.navigate(['/error', HttpStatusCode.Unauthorized]);
            } else if (err.status == HttpStatusCode.Forbidden) {
              this.toastrService.error("This action is forbidden.", "Forbidden Access");
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

  generateRandomPassword() {
    let passwordLength = 10;
    let addUpper = true;
    let addNumbers = true;
    let addSymbols = true;

    var lowerCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var upperCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var symbols = ['!', '#', '$', '%', '&', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];

    var noOfLowerCharacters = 0, noOfUpperCharacters = 0, noOfNumbers = 0, noOfSymbols = 0;
    var noOfneededTypes = 3;
    var noOfLowerCharacters = this.getRandomInt(1, passwordLength - noOfneededTypes);
    var usedTypeCounter = 1;

    if (addUpper) {
      noOfUpperCharacters = this.getRandomInt(1, passwordLength - noOfneededTypes + usedTypeCounter - noOfLowerCharacters);
      usedTypeCounter++;
    }

    if (addNumbers) {
      noOfNumbers = this.getRandomInt(1, passwordLength - noOfneededTypes + usedTypeCounter - noOfLowerCharacters - noOfUpperCharacters);
      usedTypeCounter++;
    }

    if (addSymbols) {
      noOfSymbols = passwordLength - noOfLowerCharacters - noOfUpperCharacters - noOfNumbers;
    }

    var passwordArray = [];

    for (var i = 0; i < noOfLowerCharacters; i++) {
      passwordArray.push(lowerCharacters[this.getRandomInt(1, lowerCharacters.length - 1)]);
    }

    for (var i = 0; i < noOfUpperCharacters; i++) {
      passwordArray.push(upperCharacters[this.getRandomInt(1, upperCharacters.length - 1)]);
    }

    for (var i = 0; i < noOfNumbers; i++) {
      passwordArray.push(numbers[this.getRandomInt(1, numbers.length - 1)]);
    }

    for (var i = 0; i < noOfSymbols; i++) {
      passwordArray.push(symbols[this.getRandomInt(1, symbols.length - 1)]);
    }

    passwordArray = this.shuffleArray(passwordArray);

    var generatedPassword = passwordArray.join("");

    this.form.get('password')!.setValue(generatedPassword);
    this.form.get('confirmPassword')!.setValue(generatedPassword);
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffleArray(array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  reset() {
    this.form.reset();
    this.form.get('role')!.setValue('');
    this.submitted = false;
  }

  back() {
    this.router.navigate(['/app/app-user/list']);
  }

}
