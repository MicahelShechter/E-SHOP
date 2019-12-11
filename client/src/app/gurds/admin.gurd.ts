import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdminGuard implements CanActivate{

  userToken: any;

  constructor(private authService: AuthService,
              private router: Router){ }

  canActivate() {
    this.authService.loadToken();
    this.userToken = this.authService.currentUserToken;
    const tokenInfo = this.authService.getDecodedAccessToken(this.userToken);
    console.log(tokenInfo);
    console.log(this.authService.isUserLoggedIn());
    if (this.authService.isUserLoggedIn() && tokenInfo.admin === true) {
      console.log('condition is true');
      return true;
    } else{
      console.log('condition is false');
      console.log(tokenInfo);
      this.router.navigate(['shop']);
      return false;
    }
  }
}
