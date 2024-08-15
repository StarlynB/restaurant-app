import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { HandleCartService } from 'src/app/services/handle-cart.service';
import { HandleLocalStorageService } from 'src/app/services/handle-local-storage.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  isAuthenticated: boolean = false;
  isAuthSub: Subscription;
  displayName: string | null = null;
  userdataSub: Subscription;
  isAdminSub: Subscription;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
    private router: Router,
    private handleLocalStorageService: HandleLocalStorageService,
    private handleCartService: HandleCartService
  ) {
    this.isAuthSub = this.authService.getAuthStateObservable().subscribe((data) => {
      this.isAuthenticated = data;
      if (!data) {
        this.displayName = null;
      }
    });

    this.userdataSub = this.userDataService.getUserDataObservable().subscribe((data) => {
      if (data != null && data.name != null) {
        this.displayName = data.name;
      } else {
        this.displayName = null;
      }
    });

    this.isAdminSub = this.userDataService.getIsAdminObservable().subscribe((data) => {
      this.isAdmin = !!data;
    });
  }

  ngOnInit(): void {
    // Verifica el estado de autenticación y nombre de usuario al iniciar
    this.isAuthenticated = this.handleLocalStorageService.getIsAuthenticated() === 'true';
    this.displayName = this.handleLocalStorageService.getUserName();
    this.isAdmin = this.handleLocalStorageService.getIsAdmin() === 'true';
  }

  ngOnDestroy(): void {
    this.isAdminSub.unsubscribe();
    this.userdataSub.unsubscribe();
    this.isAuthSub.unsubscribe();
  }

  onLogOut() {
    this.authService.logout();
    this.handleLocalStorageService.setIsAuthenticated('false');
    this.isAuthenticated = false;
    this.displayName = null;
    this.handleLocalStorageService.removeCartData();
    this.router.navigate(['/login']);
  }

  visitProfile() {
    const name = this.userDataService.getName!.split(' ').join('-');
    this.router.navigate(['profile', name]);
  }

  onManageItems() {
    this.router.navigate(['admin/items']);
  }

  onMyCart() {
    this.router.navigate(['cart']);
  }

  onMyOrders() {
    this.router.navigate(['orders']);
  }

  onManageOrders() {
    this.router.navigate(['admin/manage-orders']);
  }

  onManageUsers() {
    this.router.navigate(['admin/manage-users']);
  }
}
