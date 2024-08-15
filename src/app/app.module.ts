import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';


import { enviroment } from 'src/environments/environment';
import { AddOrEditTemsComponent } from './admin/add-or-edit-tems/add-or-edit-tems.component';
import { DisplayTemsComponent } from './admin/display-tems/display-tems.component';
import { DisplayOrdersComponent } from './admin/display-orders/display-orders.component';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { CarPageComponent } from './car-page/car-page.component';
import { CartComponent } from './cart/cart.component';
import { CategoryPageComponent } from './category-page/category-page.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './home/categories/categories.component';
import { HeaderImageComponent } from './home/header-image/header-image.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CartIconComponent } from './global/cart-icon/cart-icon.component';
import { DessertIconComponent } from './global/dessert-icon/dessert-icon.component';
import { DrinksIconComponent } from './global/drinks-icon/drinks-icon.component';
import { FooterComponent } from './global/footer/footer.component';
import { LoaderComponent } from './global/loader/loader.component';
import { MainIconComponent } from './global/main-icon/main-icon.component';
import { NavbarComponent } from './global/navbar/navbar.component';
import { provideDatabase } from '@angular/fire/database';
import { getDatabase } from 'firebase/database';
import { NotFoundComponent } from './global/not-found/not-found.component';
import { StartersIconComponent } from './global/starters-icon/starters-icon.component';
import { HandleLocalStorageService } from './services/handle-local-storage.service';
import { AuthGuardService } from './route-guard/auth-guard.service';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';

//external
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxSpinnerModule } from "ngx-spinner";
import { DisplayUserComponent } from './admin/display-user/display-user.component';



@NgModule({
  declarations: [
    AppComponent,
    AddOrEditTemsComponent,
    DisplayTemsComponent,
    DisplayOrdersComponent,
    ManageOrdersComponent,
    SignupComponent,
    LoginComponent,
    CarPageComponent,
    CartComponent,
    CategoryPageComponent,
    ConfirmOrderComponent,
    HomeComponent,
    CategoriesComponent,
    HeaderImageComponent,
    OrderPageComponent,
    UserProfileComponent,
    CartIconComponent,
    DrinksIconComponent,
    FooterComponent,
    LoaderComponent,
    MainIconComponent,
    NavbarComponent,
    NotFoundComponent,
    StartersIconComponent,
    DessertIconComponent,
    ManageUsersComponent,
    DisplayUserComponent
  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    NgxPayPalModule,
    NgxSpinnerModule,

    provideFirebaseApp(() => initializeApp(enviroment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnalytics(() => getAnalytics()),
    provideDatabase(() => getDatabase())
  ],

  providers: [
    ScreenTrackingService,
    UserTrackingService,
    HandleLocalStorageService,
    AuthGuardService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
