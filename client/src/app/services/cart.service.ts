import { Injectable } from '@angular/core';
import {Cart} from '../models/Cart';
import {Product} from '../models/Product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: Cart;
  carProduct: Product[];

  constructor(private http: HttpClient,
              private authService: AuthService
  ) { }
  createCart(userId): Observable<Cart> {
    return this.http.post<Cart>(
      `http://localhost:3000/api/cart/createCart/`, {userId});
  }

  getUserCartStatus(userId, token): Observable<any> {
    return this.http.get<any>(
      `http://localhost:3000/api/cart/getUserCartStatus/${userId}`,
      {headers: {Authorization: token }});
  }
  updateCartStatus(cartId, cartStatus): Observable<Cart> {
    return this.http.put<Cart>(
      `http://localhost:3000/api/cart/updateCartStatus/${cartId}`,
      cartStatus );
  }
  addProductToCart(cartId, product): Observable<Product> {
    console.log(product);
    return this.http.put<Product>(
      `http://localhost:3000/api/cart/addProductToCart/${cartId}`,
      product, );
  }
  deleteProductFromCart(cartId, productId, token): Observable<any> {
    console.log(`Service params: cartId = ${cartId} || productId = ${productId} `);
    return this.http.put<any>(
      `http://localhost:3000/api/cart/deleteProductFromCart/${cartId}`, {productId} , {headers: {Authorization: token }});
  }
  deleteAllProductsFromCart(cartId, token): Observable<Cart> {
    return this.http.put<Cart>(
      `http://localhost:3000/api/cart/deleteAllProducts/${cartId}`, {headers: {Authorization: token }});
  }

  setCartTotalPrice(cartId, totalCartPrice, token): Observable<Cart> {
    return this.http.put<Cart>(
      `http://localhost:3000/api/cart/setCartTotalPrice/${cartId}`,
      totalCartPrice);
  }
}
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
