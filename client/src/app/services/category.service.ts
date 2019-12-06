import { Injectable } from '@angular/core';
import {Category} from '../models/Category';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Product} from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoryURL = 'http://localhost:3000/api/category/';
  categories: Category[];
  constructor(private http: HttpClient) { }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:3000/api/category/categories/');
  }
}
