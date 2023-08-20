import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JWTToken } from 'src/app/model/JWTToken';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { HttpStatusCode } from '@angular/common/http';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {

  userNotFoundMsg: string = "";
  wrongPasswordMsg: string = "";
  submitted = false;

  form = new FormGroup({
    userId: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    let token = this.authService.getJwtToken();
    if (token) {
      this.router.navigate(['/']);
    }
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let userId = this.form.get(['userId'])!.value;
    let password = this.form.get(['password'])!.value;
    this.authService.authenticate(userId, password).subscribe({
      next: (res: JWTToken) => {
        this.authService.storeJwtToken(res);
        this.userService.fetchApplicationUserByUsername(userId).subscribe({
          next: (appUser: ApplicationUser) => {
            this.userService.storeUserProfileInfo(appUser);
            this.router.navigate(['/app/profile']);
          },
          error: (err) => {
            if (err.status == HttpStatusCode.NotFound) {
              this.userNotFoundMsg = "User does not exist.";
            } else if (err.status >= 400 && err.status < 500) {
              this.toastrService.error("Something went wrong.", "Client Error");
            } else if (err.status >= 500) {
              this.toastrService.error("Please contact administrator.", "Server Error");
            } else {
              this.toastrService.error("Something went wrong.", "Unknown Error");
            }
          }
        });
      },
      error: (err) => {
        if (err.status == HttpStatusCode.NotFound) {
          this.userNotFoundMsg = "User does not exist.";
          this.wrongPasswordMsg = "";
        } else if (err.status == HttpStatusCode.Unauthorized) {
          this.userNotFoundMsg = "";
          this.wrongPasswordMsg = "Password is wrong.";
        } else if (err.status >= 400 && err.status < 500) {
          if (err.status == HttpStatusCode.Locked) {
            this.toastrService.error("Please contact administrator.", "Account Disabled");
          } else {
            this.toastrService.error("Something went wrong.", "Client Error");
          }
        } else if (err.status >= 500) {
          this.toastrService.error("Please contact administrator.", "Server Error");
        } else {
          this.toastrService.error("Something went wrong.", "Unknown Error");
        }
      }
    });
  }

  back() {
    this.router.navigate(['anonymous/home']);
  }

}
