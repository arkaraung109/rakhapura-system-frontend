import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-anonymous',
  templateUrl: './anonymous.component.html',
  styleUrls: ['./anonymous.component.css']
})
export class AnonymousComponent implements OnInit {

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

  navigateToSigninForm(): void {
    this.router.navigate(['auth']);
  }

}
