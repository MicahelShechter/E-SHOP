import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';


import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';

import { AboutComponent } from './about/about.component';
import { StatusComponent } from './status/status.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AuthService } from './services/auth.service';
import {ProductService} from './services/product.service';
import { ShopComponent } from './shop/shop.component';
import { AdminComponent } from './admin/admin.component';
import { EditComponent } from './admin/edit/edit.component';
import { AddComponent } from './admin/add/add.component';
import {MatButtonToggleModule, MatDialogModule, MatListModule, MatMenuModule, MatTableModule} from '@angular/material';
import { ShopAddComponent } from './shop/shop-add/shop-add.component';
import { RegisterComponent } from './register/register.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing';
import {AuthGuard} from './gurds/auth.gurd';
import {AdminGuard} from './gurds/admin.gurd';
import { HomeComponent } from './home/home.component';
import { CountUpModule } from 'countup.js-angular2';
import { OrderComponent } from './order/order.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from "@angular/material/core";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    AboutComponent,
    StatusComponent,
    ShopComponent,
    AdminComponent,
    EditComponent,
    AddComponent,
    ShopAddComponent,
    RegisterComponent,
    HomeComponent,
    OrderComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        AppRoutingModule,
        MatListModule,
        MatButtonToggleModule,
        MatTableModule,
        MatMenuModule,
        CountUpModule,
        MatGridListModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
  entryComponents: [EditComponent, AddComponent, ShopAddComponent],
  providers: [AuthService, ProductService, AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
