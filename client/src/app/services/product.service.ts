import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';

@Injectable({
  providedIn: "root"
})
export class ProductService {
  productURL: string = `http://localhost:3000/api/product/`;
  products: Product[];
  data: Observable<any>;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productURL);
  }
  editProduct(productId, editProduct): Observable<Product> {
    return this.http.put<Product>(`http://localhost:3000/api/product/editProductById/${productId}`, editProduct);
  }
  addProduct(product): Observable<Product> {
    return this.http.post<Product>('http://localhost:3000/api/product/addProduct', product);
  }
}
