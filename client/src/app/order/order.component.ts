import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {CartService} from '../services/cart.service';
import {ProductService} from '../services/product.service';
import {OrderService} from '../services/order.service';
import {Cart} from '../models/Cart';
import {Product} from '../models/Product';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  cart: Cart;
  userId: string;
  userToken: string;
  products: Product[];
  productsObj: {};
  currentCartProducts: Product[];
  cartId: string;
  totalCartPrice: number;
  orderForm: FormGroup;
  fullyBookedDates: any = [];
  minDate: Date = new Date();
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllProducts();
    this.authService.loadUserCart();
    this.authService.loadToken();
    this.userToken = this.authService.currentUserToken;
    this.userId = this.authService.userCart.userId;
    this.cartId = this.authService.userCart._id;
    this.getCartTotalPrice();
    this.currentCartProducts = this.authService.userCart.products;
    this.getFullyBookedDates();

    this.orderForm  = this.formBuilder.group({
      city: ['', Validators.required],
      street: ['', Validators.required],
      shippingDate: ['', Validators.required],
      creditCard: ['', Validators.required]
    });
  }


  getAllProducts() {
    this.productService.getProducts().subscribe(product => {
      this.products = product;
      console.log(this.products);
      this.convertJson(product);
    });
  }
  convertJson(jsonData) {
    const productsObj = {};
    // tslint:disable-next-line:forin
    for (const  i  in jsonData ) {
      console.log(jsonData[i]);
      productsObj[jsonData[i]._id] = jsonData[i];
    }
    this.productsObj = productsObj;
  }
  getCartTotalPrice() {
    this.cartService.getUserCartStatus(this.userId, this.userToken).subscribe(data => {
      this.totalCartPrice = data.cart.totalCartPrice;
      console.log(this.totalCartPrice);
    });
  }

  orderSubmit() {
    const orderDetails = this.orderForm.getRawValue();
    const creditCard = orderDetails.creditCard.toString();
    const shippingDate = new DatePipe('en').transform(orderDetails.shippingDate, 'yyyy/MM/dd');
    const products = this.authService.userCart.products;
    const order = {
      userId: this.userId,
      cartId: this.cartId,
      totalPrice: this.totalCartPrice,
      city: orderDetails.city,
      street: orderDetails.street,
      shippingDate: shippingDate,
      creditCard: creditCard,
      products: products
    };
    console.log(order);

    this.orderService.createNewOrder(order, this.userToken).subscribe(data => {
      if (data.success) {
        const orderDates = {
          shippingDate: new DatePipe('en').transform(shippingDate, 'dd/MM/yyyy'),
          orderDate: new DatePipe('en').transform(new Date(), 'dd/MM/yyyy')
        };
        localStorage.setItem('orderDates', JSON.stringify(orderDates));

        const userId = {userId: this.userId};
        this.cartService.createCart(userId).subscribe(data => {
          this.authService.storecartData(data.cart);
        });
        this.router.navigate(['shop']);
      }
    }, err => {
      if (err.status === 400) {
        Object.keys(err.error).forEach(prop => {
          console.log(prop)
          const formControl = this.orderForm.get(prop);
          if (formControl) {
            console.log(formControl)
            // activate the error messages
            formControl.setErrors({
              serverError: err.error[prop]
            });
          }
        });
      }
    });
  }

  getUserAddress() {
    this.authService.loadUserPayload();
    console.log(this.authService.loadUserPayload());
    this.orderForm.controls['city'].setValue(this.authService.currentUserData.city);
    this.orderForm.controls['street'].setValue(this.authService.currentUserData.street);
  }
  getFullyBookedDates() {
      console.log('in function');
      this.orderService.getFullyBookedDates(this.userToken).subscribe(data => {
       this.fullyBookedDates = data.map(obj => new Date(obj.date).getTime());
     });
  }

  myFilter = (d: Date): boolean => {
    const day: any = d.getDay();
    return (!this.fullyBookedDates.includes(d.valueOf()));
  };

  dateClass = (d: Date) => {
    const day: any = d.getDay();
    return (this.fullyBookedDates.includes(d.valueOf())) ? 'occupied-date-class' : undefined;
  }
}
