import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.loadUserPayload();
    this.authService.isUserLoggedIn();
  }
  onlogOut() {
    this.authService.logoutUser();
    this.router.navigate(['']);
    return false;
  }

}
