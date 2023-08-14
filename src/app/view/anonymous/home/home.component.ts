import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router, 
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    let requestToken: string = this.authenticationService.getJwtToken();
    if(requestToken) {
      this.router.navigate(['/app/profile']);
    }
  }

  navigateToSignin() {
    this.router.navigate(['auth']);
  }

  navigateToPublicExamResult() {
    this.router.navigate(['/anonymous/public-exam-result']);
  }

}
