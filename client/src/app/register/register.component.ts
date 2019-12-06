import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Router } from '@angular/router';
import { City } from '../models/City';
import {AuthService} from '../services/auth.service';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  private formIsValid: boolean = false;
  private userIsRegistered: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['shop']);
    }
    this.firstFormGroup = this.formBuilder.group({
      idNumber: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      firstName: ['', Validators.compose([
        Validators.required, Validators.pattern('^[a-zA-Z ]*$')])],
      lastName: ['', Validators.compose([
        Validators.required, Validators.pattern('^[a-zA-Z ]*$')])],
      city: ['', Validators.required],
      street: ['', Validators.required]
    });
  }
  onFirstStepSubmit(stepper) {
    const signUpDetails = this.firstFormGroup.getRawValue();
    const idNumber = signUpDetails.idNumber.toString();
    const credentials = {
      idNumber: idNumber,
      email: signUpDetails.email,
      password: signUpDetails.password,
      password2: signUpDetails.password2
    };
    this.authService.checkUserCredentials(credentials).subscribe(data => {
      if (data.userChecked) {
        this.formIsValid = true;
        this.goForward(stepper);
      }
    },
      err => {
        if (err.status === 422) {
          console.log(err);
        //   Object.values(err.error.errors).forEach(prop => {
        //     console.log(prop.param);
        //     const formControl = this.firstFormGroup.get(prop.param);
        //     if (formControl) {
        //       // activate the error messages
        //       formControl.setErrors({
        //         serverError: prop.param.msg
        //       });
        //     }
        //   });
        //   this.formIsValid = false;
         }
      });
  }

  onSecondStepSubmit() {
    const credentials = this.firstFormGroup.getRawValue();
    const idNumber = credentials.idNumber.toString();
    const shippingDetails = this.secondFormGroup.getRawValue();

    const user = {
      email: credentials.email,
      idNumber: idNumber,
      password: credentials.password,
      lastName: shippingDetails.lastName,
      firstName: shippingDetails.firstName,
      city: shippingDetails.city,
      street: shippingDetails.street
    };

    this.authService.registerUser(user).subscribe(user => {
      // Login and Redirect to Dashboard after a successful register
      if (user) {
        const loginDetails = { email: credentials.email, password: credentials.password };
        this.redirectToDashboard(loginDetails);
      }
    }, err => {
      if (err.status === 400) {
        Object.keys(err.error).forEach(prop => {
          const formControl = this.secondFormGroup.get(prop);
          if (formControl) {
            formControl.setErrors({
              serverError: err.error[prop]
            });
          }
        });
        this.userIsRegistered = false;
      }
    });
  }

  redirectToDashboard(loginDetails) {
    this.authService.loginUser(loginDetails).subscribe(data => {
      if (data.user) {
        this.authService.storeUserData(data.token, data.user);
        this.authService.loadUserPayload();
        this.router.navigate(['shop']);
      }
    });
  }


  goForward(stepper: MatStepper) {
    setTimeout(() => {
      if (this.formIsValid) {
        stepper.next();
      }
    }, 1500);
  }
  allowNumbersOnly(e) {
    const code = (e.which) ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }
}
