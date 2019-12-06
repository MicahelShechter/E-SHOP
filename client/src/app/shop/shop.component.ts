import { Component, OnInit } from '@angular/core';

import { ProductService} from '../services/product.service';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {Product} from '../models/Product';
import {ShopAddComponent} from './shop-add/shop-add.component';
import {AuthService} from '../services/auth.service';
import {CartService} from '../services/cart.service';
import {CategoryService} from '../services/category.service';
import {Cart} from '../models/Cart';
import {Category} from '../models/Category';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
   products: Product[];
   productsObj: {};
  cartProducts: Record<string, Product>;
  userId: string;
  userToken: string;
  cartId: string;
  opened: boolean;
  cart: Cart;
  currentCartProducts: Product[];
  categories: Category[];
  totalCartProductsQuantity: number;
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService,
    private categoryService: CategoryService,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    let opened;
    opened = false;
    this.authService.loadUserPayload();
    this.authService.loadToken();
    this.authService.loadUserCart();
    this.userId = this.authService.currentUserData.id;
    this.userToken = this.authService.currentUserToken;
    this.getUserCartStatus();
    // this.cartId = this.authService.userCart._id;
    this.getAllProducts();
    this.getAllCategories();
  }

  openDialog(product): void {
    console.log(product);
    const dialogRef = this.dialog.open(ShopAddComponent,{
      data: {
          product: product
      }
    });

  }

  getAllProducts() {
    this.productService.getProducts().subscribe(product => {
      this.products = product;
      this.convertJson(product);
    });
  }

   // TODO: Fix this issue
   getUserCartStatus() {
    this.cartService.getUserCartStatus(this.userId,this.userToken).subscribe( data => {
      console.log(data);
      if (data.status === 0) {
        this.authService.storecartData(data.cart);
        console.log('Status = 0');
        this.cartService.carProduct = data.cart.products;
        console.log(this.cartService.carProduct);
      } else if (data.status === 1) {
        this.authService.storecartData(data.cart);
        console.log('Status  = 1');
        // TODO: cahnge
        // this.currentCartProducts = data.cart.products;
        this.cartService.carProduct = data.cart.products;
        console.log(this.cartService.carProduct);

        console.log(this.currentCartProducts);
      } else {
        console.log('Cart is Empty');
        const userId = {userId: this.userId};
        // tslint:disable-next-line:no-shadowed-variable
        this.cartService.createCart(this.userId).subscribe( data  => {
         this.authService.storecartData(data.cart);
        });
      }
       // TODO: cahnge
      // this.currentCartProducts = data.cart.products;
      console.log(data.cart.products);
      this.authService.storecartData(data.cart);
    //  totalPrice
    });
  }
  getAllCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
      // this.isLoading = false;
    });
  }
  convertJson(jsonData) {
    const productsObj = {};
    // tslint:disable-next-line:forin
    for (const  i  in jsonData ) {
      productsObj[jsonData[i]._id] = jsonData[i];

    }
    this.productsObj = productsObj;
  }
  removeCartItem(cartItemId) {
  //  TODO: Set user Token
    console.log(cartItemId);
    const productId = {cartItemId};
    console.log(productId);
    console.log(this.cartId);
    this.cartService.deleteProductFromCart(this.cartId, cartItemId, this.userToken).subscribe(data => {
      console.log(data);
      this.updateLocalStorage(data);
      // this.currentCartProducts = data;
    });
  }


  updateLocalStorage(cartData) {
    this.authService.storecartData(cartData);
    this.authService.loadUserCart();
    // TODO: cahnge
    // this.currentCartProducts = this.authService.userCart.products;
    this.cartService.carProduct = this.authService.userCart.products
  }
  }


