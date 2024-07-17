import { Component, OnInit } from '@angular/core';
import { HandleCartService } from '../services/handle-cart.service';
import { HandleLocalStorageService } from '../services/handle-local-storage.service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  isCartEmpty: boolean = false;
  totalAmt: number = 0;
  totalItems: number = 0;
  goToOrders: boolean = false;
  hideCartBar: boolean = false;

  constructor(
    private handleCartService: HandleCartService,
    private handleLocalStorage: HandleLocalStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.handleLocalStorage.getCartDataObservable().subscribe((data) => {
      // Asegúrate de que data y data.items no sean nulos o indefinidos
      if (data && data.items) {
        if (Object.keys(data.items).length > 0) {
          this.isCartEmpty = false;
          this.totalAmt = data.totalAmt;
          this.totalItems = Object.keys(data.items).length;
        } else {
          this.isCartEmpty = true;
        }
      } else {
        this.isCartEmpty = true;
      }
    });
  }

  ngOnInit(): void {
    this.handleCartService.onCartPageObs().subscribe((data) => {
      this.goToOrders = data;
    });

    this.handleCartService.onConfirmOrderPageObs().subscribe((data) => {
      this.hideCartBar = data;
    });
  }

  onContinue() {
    this.router.navigate(['cart']);
  }

  placeOrder() {
    this.router.navigate(['confirm-order']);
  }
}
