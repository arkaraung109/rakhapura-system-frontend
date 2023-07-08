import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JWTToken } from 'src/app/model/JWTToken';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { ApplicationUser } from 'src/app/model/ApplicationUser';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {

  errorMsg: string = '';
  submitted = false;
  wrongCredentials!: boolean;

  form = new FormGroup({
    userId: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    let token = this.authService.getJwtToken();
    if(token) {
      this.router.navigate(['/']);
    }
  }

  submit() {
    this.submitted = true;
    if(this.form.invalid) {
      return;
    }

    let userId = this.form.get(['userId'])!.value;
    let password = this.form.get(['password'])!.value;
    
    this.authService.authenticate(userId, password).subscribe({
      next: (res: JWTToken) => {
        this.authService.storeJwtToken(res);
        this.userService.fetchApplicationUserByUsername(userId).subscribe({
          next: (res: ApplicationUser) => {
            this.userService.storeUserProfileInfo(res);
            this.router.navigate(['/app/profile']);
          },
          error: (err) => {
            if (err.status == 204) {
              this.errorMsg = "User does not exist.";
            } else {
              this.toastr.error("Something went wrong, please try again.", "Error message");
            }
          }
        });
      },
      error: (err) => {
        this.wrongCredentials = true;
        if(err.status == 401) {
          this.errorMsg = "Username or password is wrong.";
        } else {
          this.toastr.error("Something went wrong, please try again.", "Error message");
        }
      }
    });
  }

}
