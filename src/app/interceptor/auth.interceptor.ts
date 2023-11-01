import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { LoaderService } from '../service/loader.service';

const AUTHORIZATION_HEADER: string=  'Authorization';
const BARER: string = 'Bearer ';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor(private authService: AuthenticationService,private loadingService: LoaderService) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.totalRequests++;
    this.loadingService.setLoading(true);
    
    const idToken = this.authService.getJwtToken();
    if(idToken) {
      const cloned = request.clone({
        headers: request.headers.set(AUTHORIZATION_HEADER, `${BARER}${idToken}`)
      });
      return next.handle(cloned).pipe(
        finalize(() => {
          this.totalRequests--;
          if (this.totalRequests == 0) {
            this.loadingService.setLoading(false);
          }
        }));
    } else {
      return next.handle(request).pipe(
        finalize(() => {
          this.totalRequests--;
          if (this.totalRequests == 0) {
            this.loadingService.setLoading(false);
          }
        }));
    }
  }
  
}
