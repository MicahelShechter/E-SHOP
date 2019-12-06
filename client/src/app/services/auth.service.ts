import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../models/User';
import {Cart} from '../models/Cart';
import {Credentials} from '../models/Credentials';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwt_decode from 'jwt-decode';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: string;
  loggedUser: any;
  currentUserData: User;
  currentUserToken: string;
  userCart: Cart;

  constructor(private http: HttpClient) {
  }
  loadUserPayload() {
    this.currentUserData = JSON.parse(localStorage.getItem('user'));
    console.log(this.currentUserData);
  }

  loadToken(){
    this.currentUserToken = localStorage.getItem('token');
  }


  checkUserCredentials(userCredentials): Observable<Credentials> {
    return this.http.post<Credentials>('http://localhost:3000/api/users/checkUserCredentials/', userCredentials, httpOptions);
  }
  loginUser(loginDetails): Observable<Credentials> {
    return this.http.post<Credentials>('http://localhost:3000/api/users/login/', loginDetails, httpOptions);
  }
  registerUser(user): Observable<User> {
    return  this.http.post<User>('http://localhost:3000/api/users/register', user , httpOptions);
  }
  storeUserData(token, loggedUser) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    this.authToken = token;
    this.loggedUser = loggedUser;
  }
  isUserLoggedIn = () => {
    const jwtHelper = new JwtHelperService();
    if (localStorage.token == undefined)
      return false;
    return !jwtHelper.isTokenExpired(localStorage.token);
  };

  logoutUser() {
    this.authToken = null;
    this.loggedUser = null;
    localStorage.clear();
  }

  getDecodedAccessToken = (token: string): any => {
    try{
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  };
  loadUserCart() {
    // TODO: remove this console.log
    console.log(JSON.parse(localStorage.getItem('cart')));
    this.userCart = JSON.parse(localStorage.getItem('cart'));
  }
  storecartData = (currentUserData) => {
    console.log(`Store cart date called`);
    localStorage.setItem('cart', JSON.stringify(currentUserData));
}
}
