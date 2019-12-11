import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


import {ShopComponent} from './shop/shop.component';
import {RegisterComponent} from './register/register.component';
import {AdminComponent} from './admin/admin.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './gurds/auth.gurd';
import {AdminGuard} from './gurds/admin.gurd';
import {OrderComponent} from './order/order.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'shop', component: ShopComponent, canActivate: [AuthGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
