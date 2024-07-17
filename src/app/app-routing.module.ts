import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DisplayTemsComponent } from './admin/display-tems/display-tems.component';
import { AddOrEditTemsComponent } from './admin/add-or-edit-tems/add-or-edit-tems.component';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { DisplayOrdersComponent } from './admin/display-orders/display-orders.component';
import { CategoryPageComponent } from './category-page/category-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { NotFoundComponent } from './global/not-found/not-found.component';
import { AuthGuardService } from './route-guard/auth-guard.service';
import { AdminAuthGuardService } from './route-guard/admin-auth-guard.service';
import { CartComponent } from './cart/cart.component';
import { CarPageComponent } from './car-page/car-page.component';


const routerOption: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: "enabled",
  scrollOffset: [0, 100]
}
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    component: SignupComponent,
  },
  {
    path: 'profile/:name',
    component: UserProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'admin/items',
    component: DisplayTemsComponent,
    canActivate: [AdminAuthGuardService]
  },
  {
    path: 'admin/items/add',
    component: AddOrEditTemsComponent,
    data: { path: 'add' },
    canActivate: [AdminAuthGuardService]
  },
  {
    path: 'admin/items/edit/:itemCategory/:itemId',
    component: AddOrEditTemsComponent,
    data: { path: 'edit' },
    canActivate: [AdminAuthGuardService]
  },
  {
    path: 'admin/manage-orders',
    component: ManageOrdersComponent,
    canActivate: [AdminAuthGuardService]
  },
  {
    path: 'admin/:uid/orders',
    component: DisplayOrdersComponent,
    canActivate: [AdminAuthGuardService]
  },
  {
    path: 'menu-page',
    component: CategoryPageComponent
  },
  {
    path: 'cart',
    component: CarPageComponent
  },
  {
    path: 'orders',
    component: OrderPageComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'confirm-order',
    component: ConfirmOrderComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
