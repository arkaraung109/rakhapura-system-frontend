import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { UserService } from '../service/user.service';
import { HttpStatusCode } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserPermission } from '../common/UserPermission';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let requestToken: string = this.authenticationService.getJwtToken();
    if (requestToken) {
      if (this.jwtHelper.isTokenExpired(requestToken)) {
        localStorage.clear();
        this.router.navigate(['/error', HttpStatusCode.Unauthorized]);
        return false;
      }

      const allowedRoles = route.data['allowedRoles'];
      const loginRole = this.userService.fetchUserProfileInfo().role.name;
      if (!allowedRoles.includes(loginRole) && !allowedRoles.includes(UserPermission.ANONYMOUS)) {
        this.router.navigate(['/error', HttpStatusCode.Forbidden]);
        return false;
      }
      return true;
    }
    this.router.navigate(['/auth/signin']);
    return false;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let requestToken: string = this.authenticationService.getJwtToken();
    if (requestToken) {
      if (this.jwtHelper.isTokenExpired(requestToken)) {
        localStorage.clear();
        this.router.navigate(['/error', HttpStatusCode.Unauthorized]);
        return false;
      }

      const allowedRoles = route.data['allowedRoles'];
      const loginRole = this.userService.fetchUserProfileInfo().role.name;
      if (!allowedRoles.includes(loginRole) && !allowedRoles.includes(UserPermission.ANONYMOUS)) {
        this.router.navigate(['/error', HttpStatusCode.Forbidden]);
        return false;
      }
      return true;
    }
    this.router.navigate(['/auth/signin']);
    return false;
  }

}
