import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorCode: string = `${HttpStatusCode.InternalServerError}`;
  errorMessage: string = "Something went wrong";
  returnRoute: string = '/';

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      this.errorCode = params.get('errorCode')!.toString();

      switch(this.errorCode) {
        case `${HttpStatusCode.Unauthorized}`: {
          this.errorCode = `${HttpStatusCode.Unauthorized}`;
          this.errorMessage = "Session Expired! Please login again.";
          this.returnRoute = '/auth';
          break;
        }
        case `${HttpStatusCode.Forbidden}`: {
          this.errorCode = `${HttpStatusCode.Forbidden}`;
          this.errorMessage = "Forbidden access! You have no permission.";
          this.returnRoute = '/auth';
          break;
        }
        case `${HttpStatusCode.NotFound}`: {
          this.errorCode = `${HttpStatusCode.NotFound}`;
          this.errorMessage = "Page not found";
          this.returnRoute = '/';
          break;
        }
        case `${HttpStatusCode.BadRequest}`: {
          this.errorCode = `${HttpStatusCode.BadRequest}`;
          this.errorMessage = "Bad request";
          this.returnRoute = '/';
          break;
        }
        case `${HttpStatusCode.ServiceUnavailable}`: {
          this.errorCode = `${HttpStatusCode.ServiceUnavailable}`;
          this.errorMessage = "Sorry this service is currently unavailable";
          this.returnRoute = '/';
          break;
        }  
      }
    });
  }
  
  route() {
    this.router.navigate([this.returnRoute]);
  }

}
