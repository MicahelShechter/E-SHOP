import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Order} from '../models/Order';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }
  getAllOrders(token): Observable<Order[]> {
    return this.http.get<Order[]>('http://localhost:3000/api/order/orders',{headers: {Authorization: token }});
  }
  getOrdersLength(): Observable<number> {
    return this.http.get<number>('http://localhost:3000/api/order/ordersLength');
  }

  createNewOrder(order, token): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/order/createNewOrder', order, {headers: {Authorization: token }});
  }

  getFullyBookedDates(token): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/order/getFullyBookedDates',{headers: {Authorization: token }});
  }

  checkIfUserHasOrder(userId, token): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/order/getLatestOrderByUserId/${userId}`,{headers: {Authorization: token }});
  }
}


