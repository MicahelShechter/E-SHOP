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
import {OrderService} from '../services/order.service';
import { Router } from '@angular/router';


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
  cartStatus: any;
  totalCartPrice: number ;
  totalPrice: number;
  totalCartProductsQuantity: number;
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    public dialog: MatDialog,
    private router: Router
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
    this.cartId = this.authService.userCart._id;
    this.getAllProducts();
    this.getAllCategories();
  }

  openDialog(product, productList): void {

    const dialogRef = this.dialog.open(ShopAddComponent,{
      data: {
          product: product,
          productList: productList
      }
    });

  }

  getAllProducts() {
    this.productService.getProducts().subscribe(product => {
      this.products = product;
      this.convertJson(product);
    });
  }

   getUserCartStatus() {
    this.cartService.getUserCartStatus(this.userId,this.userToken).subscribe( data => {
      if (data.status === 0) {
        this.authService.storecartData(data.cart);
        this.cartService.carProduct = data.cart.products;
        this.cartService.cartTotalPrice = data.cart.totalCartPrice;
      } else if (data.status === 1) {
        this.authService.storecartData(data.cart);
        this.cartService.carProduct = data.cart.products;
        this.cartService.cartTotalPrice = data.cart.totalCartPrice;
      } else {
        const userId = {userId: this.userId};
        this.cartService.createCart(this.userId).subscribe(data => {
          this.authService.storecartData(data.cart);
        });
      }
      this.authService.storecartData(data.cart);
    });
  }
  getAllCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
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
    const productId = {cartItemId};
    this.cartService.deleteProductFromCart(this.cartId, cartItemId, this.userToken).subscribe(data => {
      this.updateLocalStorage(data);
      this.setTotalPrice();
      this.updateCartPrice();
    });
  }
  emptyCart() {
    this.cartService.deleteAllProductsFromCart(this.cartId, this.userToken).subscribe(data => {
      console.log(`The return data after empty cart ->  ${data}`);
      this.updateLocalStorage(data);
      this.cartService.carProduct = this.authService.userCart.products;
      console.log(`Calling to setPrice`);
      this.setTotalPrice();
      this.updateCartPrice();
    });
    const status = {isOpen: 0};
    const cartId = this.cartId;
  }


  updateLocalStorage(cartData) {
    this.authService.storecartData(cartData);
    this.authService.loadUserCart();
    this.cartService.carProduct = this.authService.userCart.products;
    this.cartService.cartTotalPrice = this.totalCartPrice;
  }

  setTotalPrice() {
    this.totalCartPrice  = 0;
    for (const  i  of this.cartService.carProduct) {
      this.totalCartPrice += i.quantity *   this.productsObj[i._id].price;
    }
  }

  updateCartPrice() {
    const totalCartPrice = {totalCartPrice: this.totalCartPrice};
    this.cartService.setCartTotalPrice(this.cartId, totalCartPrice, this.userToken).subscribe(data => {
      this.updateLocalStorage(data);
      this.cartService.cart = data;
    });
  }
  }


