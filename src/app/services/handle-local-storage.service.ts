import { BehaviorSubject } from 'rxjs';
import { Cart } from '../models/cart.model';

export class HandleLocalStorageService {
  cartDataSub = new BehaviorSubject<Cart | null>(null);

  constructor() { }

  setUser(value: string) {
    localStorage.setItem('user', value);
  }

  getUser(): string | null {
    return localStorage.getItem('user');
  }

  setIsAuthenticated(value: string) {
    localStorage.setItem('isAuthenticated', value);
  }

  getIsAuthenticated(): string | null {
    return localStorage.getItem('isAuthenticated');
  }

  setIsAdmin(value: string) {
    localStorage.setItem('isAdmin', value);
  }

  getIsAdmin(): string | null {
    return localStorage.getItem('isAdmin');
  }

  setUserName(value: string) {
    localStorage.setItem('name', value);
  }

  getUserName(): string | null {
    return localStorage.getItem('name');
  }

  clearLocalStorage(): void {
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('name');
    localStorage.removeItem('user');
  }

  addCartData(cart: Cart) {
    localStorage.setItem('cartData', JSON.stringify(cart));

    const obj = JSON.parse(localStorage.getItem('cartData')!);

    // check if items in cart is empty
    if (Object.keys(obj.items).length == 0) {
      this.removeCartData();
    }

    this.cartDataSub.next(JSON.parse(this.getCartData()!));
  }

  getCartData(): string | null {
    return localStorage.getItem('cartData');
  }

  getCartDataObservable() {
    this.cartDataSub.next(JSON.parse(this.getCartData()!));
    return this.cartDataSub.asObservable();
  }

  removeCartData() {
    localStorage.removeItem('cartData');
    this.cartDataSub.next(null);
  }
}
