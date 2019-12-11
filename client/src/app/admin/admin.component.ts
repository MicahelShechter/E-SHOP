import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import {CategoryService} from '../services/category.service';
import { MatDialog } from '@angular/material/dialog';
import {Product} from '../models/Product';
import {Category} from '../models/Category';
import {EditComponent} from './edit/edit.component';
import {AddComponent} from './add/add.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  products: Product[];
  categories: Category[];
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.getAllProducts();
    this.getAllCategories();
  }
  getAllProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
  openEditDialog(productValues): void {
    const dialogRef = this.dialog.open(EditComponent, {

      data: {
        preEditFields: productValues,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllProducts();
    });
  }
  openAddDialog(categoriesObject): void {
    const dialogRef = this.dialog.open(AddComponent, {
      data: {
        categories: categoriesObject
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllProducts();
    });
  }
  getAllCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    }
    );
  }
}
