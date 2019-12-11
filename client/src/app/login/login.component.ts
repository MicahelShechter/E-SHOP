import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
// import {User} from '../models/User';
import {AuthService} from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  // user: User = {
  //   email: '',
  //   password: ''
  // };
  constructor(
    private formBuilder: FormBuilder,
    private  authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.isUserLoggedIn()){
      this.router.navigate(['/shop']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      const formValues =  this.loginForm.getRawValue();
      const userDetails = {
        email: formValues.email.toLocaleLowerCase(),
        password: formValues.password
      };
      this.authService.loginUser(userDetails).subscribe(data => {
            if(data.admin) {
              this.authService.storeUserData(data.token, data.admin);
              this.authService.loadUserPayload();
              this.router.navigate(['admin']);
            }
            if(data.user){
              this.authService.storeUserData(data.token, data.user);
              this.authService.loadUserPayload();
              this.router.navigate(['shop']);
            }
      }, error => {
        console.log(error);
      });
    }
  }
}
