import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorCode } from 'src/app/common/HttpErrorCode';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorCode: string = `${HttpErrorCode.INTERNAL_SERVER_ERROR}`;
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
        case `${HttpErrorCode.UNAUTHORIZED}`: {
          this.errorCode = `${HttpErrorCode.UNAUTHORIZED}`;
          this.errorMessage = "Session Expired! Please login again.";
          this.returnRoute = '/auth';
          break;
        }
        case `${HttpErrorCode.FORBIDDEN}`: {
          this.errorCode = `${HttpErrorCode.FORBIDDEN}`;
          this.errorMessage = "Forbidden access! You have no permission.";
          this.returnRoute = '/auth';
          break;
        }
        case `${HttpErrorCode.NOT_FOUND}`: {
          this.errorCode = `${HttpErrorCode.NOT_FOUND}`;
          this.errorMessage = "Page not found";
          this.returnRoute = '/';
          break;
        }
        case `${HttpErrorCode.BAD_REQUEST}`: {
          this.errorCode = `${HttpErrorCode.BAD_REQUEST}`;
          this.errorMessage = "Bad request";
          this.returnRoute = '/';
          break;
        }
        case `${HttpErrorCode.SERVICE_UNAVAILABLE}`: {
          this.errorCode = `${HttpErrorCode.SERVICE_UNAVAILABLE}`;
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
