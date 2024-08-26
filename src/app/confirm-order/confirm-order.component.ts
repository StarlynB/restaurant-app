import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { HandleCartService } from '../services/handle-cart.service';
import { HandleLocalStorageService } from '../services/handle-local-storage.service';
import { Cart } from '../models/cart.model';
import { OrderDataService } from '../services/order-data.service';
import { UserDataService } from '../services/user-data.service';
import { ItemDataService } from '../services/item-data.service';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { enviroment } from 'src/environments/environment';
import { ExchangeRateService } from '../services/exchange-rate.service';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss'],
})
export class ConfirmOrderComponent implements OnInit, OnDestroy {
  cartObj: Cart;
  orderArray: any[] = [];
  totalAmt: string | undefined;
  itbis_Amt: number | undefined;
  isOrdered: boolean = false;
  isProcessing: boolean = false;
  addressNotFound: boolean = false;
  notAvailableItems: any[] = [];
  itemAvailabilityChecked: boolean = false;
  private subscription: Subscription = new Subscription();

  public payPalConfig?: IPayPalConfig;
  private dollarPrice: number | undefined;

  constructor(
    private handleCartService: HandleCartService,
    private handleLocalStorageService: HandleLocalStorageService,
    private router: Router,
    private orderDataService: OrderDataService,
    private userDataService: UserDataService,
    private itemDataService: ItemDataService,
    private exchangeRateService: ExchangeRateService
  ) {
    this.cartObj = JSON.parse(this.handleLocalStorageService.getCartData()!);
  }

  ngOnInit(): void {
    this.exchangeRateService.getDollarPrice().subscribe(price => {
      this.dollarPrice = price;
      console.log(this.dollarPrice)
      this.initConfig();
    });

    this.populateOrderData();
    this.handleCartService.hideCartBar(true);

    this.userDataService.checkAddressPresentOrNot().then((data: string) => {
      if (!data || data.trim().length < 1) {
        this.addressNotFound = true;
      }
    });
  }

  ngOnDestroy() {
    this.handleCartService.hideCartBar(false);
    this.subscription.unsubscribe();
  }

  populateOrderData() {
    if (this.cartObj && this.cartObj.items) {
      const itemD = this.cartObj.items;

      for (let item in itemD) {
        const itemObj = itemD[item];

        this.orderArray.push({
          id: itemObj.itemId,
          category: itemObj.category,
          name: itemObj.name,
          price: itemObj.price,
          quantity: itemObj.quantity,
          imageUrl: itemObj.imageUrl
        });
      }
    }

    this.calculateTotalAmount();
  }

  getItemTotalAmount(price: number, quantity: number) {
    return Number(price) * Number(quantity);
  }

  calculateTotalAmount() {
    const itbisAmtNumber = (18 / 100) * Number(this.cartObj.totalAmt);
    this.itbis_Amt = parseFloat(itbisAmtNumber.toFixed(2));
    this.totalAmt = (Number(this.cartObj.totalAmt) + this.itbis_Amt!).toFixed(2);
  }

  goBackToCart() {
    this.router.navigate(['cart']);
  }

  confirm() {
    if (this.addressNotFound) {
      return;
    }

    this.onConfirm();
  }

  async onConfirm() {
    this.isProcessing = true;
    this.notAvailableItems = await this.itemDataService.reportItemAvailability(this.orderArray);

    if (this.notAvailableItems.length > 0) {
      this.isProcessing = false;
    } else {
      this.cartObj = null!;
      this.handleLocalStorageService.removeCartData();

      this.orderDataService.addOrderData(this.orderArray, this.totalAmt!).subscribe(
        (res: any) => {
          this.isOrdered = true;
          this.orderDataService.setOrderId(res.name);
          this.startLottieTimer();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  startLottieTimer() {
    this.subscription.add(timer(4000).subscribe(() => {
      this.isOrdered = false;
      this.router.navigate(['orders'])
    }));
  }

  goToProfile() {
    const _name = this.makeProfilePath(this.handleLocalStorageService.getUserName()!);
    this.router.navigate(['profile', _name]);
  }

  private initConfig(): void {
    if (!this.dollarPrice) {
      console.error('Dollar price is not defined.');
      return;
    }

    const items = this.orderArray.map(item => ({
      name: item.name,
      quantity: item.quantity.toString(),
      category: 'PHYSICAL_GOODS',
      unit_amount: {
        currency_code: 'USD',
        value: (item.price / this.dollarPrice!).toFixed(2),
      },
    }));

    const itemTotalValue = items.reduce((total, item) => {
      return total + (parseFloat(item.unit_amount.value) * parseInt(item.quantity));
    }, 0);

    const taxTotalValue = (18 / 100) * itemTotalValue;
    const totalValue = itemTotalValue + taxTotalValue;

    this.payPalConfig = {
      currency: 'USD',
      clientId: enviroment.clientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: totalValue.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: itemTotalValue.toFixed(2)
              },
              tax_total: {
                currency_code: 'USD',
                value: taxTotalValue.toFixed(2)
              }
            }
          },
          items: items
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', JSON.stringify(data));
        this.confirm();
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
  }

  makeProfilePath(v: string) {
    return v.split(' ').join('-');
  }
}
