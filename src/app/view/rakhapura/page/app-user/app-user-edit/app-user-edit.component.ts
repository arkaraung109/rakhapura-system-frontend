import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { whiteSpaceValidator } from 'src/app/validator/white-space.validator';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { HttpStatusCode } from '@angular/common/http';
import { spaceValidator } from 'src/app/validator/space.validator';
import { confirmPasswordValidator } from 'src/app/validator/confirm-password.validator';
import { RoleService } from 'src/app/service/role.service';
import { UserService } from 'src/app/service/user.service';
import { UserRole } from 'src/app/model/UserRole';
import { ApplicationUser } from 'src/app/model/ApplicationUser';

@Component({
  selector: 'app-app-user-edit',
  templateUrl: './app-user-edit.component.html',
  styleUrls: ['./app-user-edit.component.css']
})
export class AppUserEditComponent implements OnInit {

  submitted = false;
  roleList!: UserRole[];
  id!: number;
  currentPage!: number;
  searchedRole!: number;
  keyword!: string;
  oldApplicationUser!: ApplicationUser;

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
      Validators.pattern("^(?=.*[A-Z])(?=.*[`~^?()\\{\\}\\[\\]|;,:<>?\\\\/!@#$%&*\\-_+=])(?=.*[0-9])(?=.*[a-z]).{8,30}$"),
      whiteSpaceValidator(),
      spaceValidator()
    ]),
    confirmPassword: new FormControl('', [
      Validators.pattern("^(?=.*[A-Z])(?=.*[`~^?()\\{\\}\\[\\]|;,:<>?\\\\/!@#$%&*\\-_+=])(?=.*[0-9])(?=.*[a-z]).{8,30}$"),
      whiteSpaceValidator(),
      spaceValidator()
    ]),
  }, { validators: confirmPasswordValidator('password', 'confirmPassword') });

  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.currentPage = params['currentPage'];
      this.searchedRole = params['searchedRole'];
      this.keyword = params['keyword'];
    });

    this.roleService.fetchAll().subscribe(data => {
      this.roleList = data;
    });

    this.userService.fetchById(this.id).subscribe(data => {
      this.form.get('firstName')!.setValue(data.firstName);
      this.form.get('lastName')!.setValue(data.lastName);
      this.form.get('loginUserName')!.setValue(data.loginUserName);
      this.form.get('role')!.setValue(data.role.id);
      this.oldApplicationUser = data;
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
        let requestBody: ApplicationUser = new ApplicationUser();
        requestBody.firstName = this.form.get('firstName')!.value.trim();
        requestBody.lastName = this.form.get('lastName')!.value.trim();
        requestBody.loginUserName = this.form.get('loginUserName')!.value.trim();
        requestBody.password = this.form.get('password')!.value.trim();
        requestBody.activeStatus = this.oldApplicationUser.activeStatus;
        requestBody.role.id = this.form.get('role')!.value;
        this.userService.updateAppUser(requestBody, this.oldApplicationUser.id).subscribe({
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
            } else if (err.status == HttpStatusCode.NotAcceptable) {
              this.toastrService.warning("You cannot update this.", "Disabled Account");
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
    this.form.get('firstName')!.setValue(this.oldApplicationUser.firstName);
    this.form.get('lastName')!.setValue(this.oldApplicationUser.lastName);
    this.form.get('loginUserName')!.setValue(this.oldApplicationUser.loginUserName);
    this.form.get('password')!.reset();
    this.form.get('confirmPassword')!.reset();
    this.form.get('role')!.setValue(this.oldApplicationUser.role.id);
    this.submitted = false;
  }

  back() {
    this.router.navigate(['app/app-user/list'], {
      queryParams: {
        currentPage: this.currentPage,
        searchedRole: this.searchedRole,
        keyword: this.keyword
      },
      skipLocationChange: true
    });
  }

}
