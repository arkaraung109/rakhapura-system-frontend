import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css']
})
export class ProfileDetailComponent implements OnInit {

  user!: ApplicationUser;

  constructor(
    private router: Router,
    private userService: UserService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.fetchUserProfileInfo();

    if (localStorage.getItem("status") == "updated") {
      this.toastrService.success("Successfully Updated");
    }

    localStorage.removeItem("status");
  }

}
