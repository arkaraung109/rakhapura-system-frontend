import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

const AUTHORIZATION_HEADER: string=  'Authorization';
const BARER: string = 'Bearer ';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const idToken = this.authService.getJwtToken();
    if(idToken) {
      const cloned = request.clone({
        headers: request.headers.set(AUTHORIZATION_HEADER, `${BARER}${idToken}`)
      });
      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }
  
}
