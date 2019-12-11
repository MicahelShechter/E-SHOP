import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Product} from '../../models/Product';
import {CartService} from '../../services/cart.service';
import {AuthService} from '../../services/auth.service';
import {ProductService} from '../../services/product.service';
import {forEach} from "@angular/router/src/utils/collection";



@Component({
  selector: 'app-shop-add',
  templateUrl: './shop-add.component.html',
  styleUrls: ['./shop-add.component.css']
})
export class ShopAddComponent implements OnInit {
  addToCartForm: FormGroup;
  userId: string;
  userToken: string;
  cartId: string;
  currentCartProducts: Product[];
  quantity: number = 0;
  totalPrice: number;
  productId: string;
  formQantity: number;
  @Input() productsObj: {};
  productList: [];

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ShopAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit() {
    // Get user info
    this.authService.loadUserPayload();
    this.authService.loadToken();
    this.authService.loadUserCart();
    this.userId = this.authService.currentUserData.id;
    this.userToken = this.authService.currentUserToken;
    this.cartId = this.authService.userCart._id;
    this.getUserCartStatus();



    this.addToCartForm = this.formBuilder.group({
      quantity: ['', Validators.required]
    });
    const addFrom = this.addToCartForm.controls;
    const productId = this.data.product;
    this.productList  = this.data.productList;
  }
  addToCart(productParam) {
    // TODO: remove all console.log
    console.log(`product param = ${productParam._id}`);
    console.log(` currentCartProducts  =  ${this.currentCartProducts}`);
    this.formQantity = Number(this.addToCartForm.getRawValue().quantity);
    console.log(this.formQantity);
    const  cartProduct = this.currentCartProducts.find(product => product._id === productParam._id);
    if (cartProduct === undefined) {
      this.productId = productParam._id;
      this.quantity += this.formQantity;
      console.log(`this quantiy value ->  ${this.quantity}`);
      console.log(`Cart id  = ${this.cartId}`);
      this.cartService.addProductToCart(this.cartId, {_id: this.productId, quantity: this.quantity}).subscribe(data => {
        this.updateLocalStorage(data);
        this.cartService.carProduct = this.authService.userCart.products;
        this.setTotalPrice();
        this.updateCartPrice();
        this.dialogRef.close();
       });
       } else if (cartProduct._id === productParam._id) {
       console.log(`product already exist`);
       this.productId = productParam._id;
       this.quantity = cartProduct.quantity as any;
       this.quantity += this.formQantity;
       this.cartService.addProductToCart(this.cartId, {_id: this.productId, quantity: this.quantity}).subscribe(data => {
         this.updateLocalStorage(data);
         this.cartService.carProduct = this.authService.userCart.products;
         this.setTotalPrice();
         this.updateCartPrice();
         this.dialogRef.close();
      });
    }
  }
  getUserCartStatus() {
    this.cartService.getUserCartStatus(this.userId, this.userToken).subscribe(data => {
      this.currentCartProducts = data.cart.products;
      // TODO: remove this console log row
      this.currentCartProducts.forEach((index) => {
        console.log(index);
      });
      this.totalPrice = data.cart.totalCartPrice;
      console.log(this.totalPrice);
      // this.setTotalPrice();
    });
  }
  setTotalPrice() {
    this.totalPrice  = 0;
    for (const  i  of this.currentCartProducts) {
      console.log(`Set price | item = ${this.productList[i._id].price}`);
      console.log(`quantity = ${i.quantity}`);
      this.totalPrice += i.quantity *   this.productList[i._id].price;
    }
  }
  updateCartPrice() {
    const totalCartPrice = {totalCartPrice: this.totalPrice};
    this.cartService.setCartTotalPrice(this.cartId, totalCartPrice, this.userToken).subscribe(data => {
      this.updateLocalStorage(data);
      this.cartService.cart = data;
    });
  }

  updateLocalStorage(cartData) {
    this.authService.storecartData(cartData);
    this.authService.loadUserCart();
    this.currentCartProducts = this.authService.userCart.products;
    this.cartService.cartTotalPrice =  this.totalPrice;
  }

}
