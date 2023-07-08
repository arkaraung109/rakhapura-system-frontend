import { Component, OnInit } from '@angular/core';
import { ApplicationUser } from 'src/app/model/ApplicationUser';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  user!: ApplicationUser;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.userService.fetchUserProfileInfo();
  }

}
