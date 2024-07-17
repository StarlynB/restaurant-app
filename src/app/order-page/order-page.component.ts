import { Component, OnInit } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';
import { Order } from '../models/order.model';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit {
  orders: any;
  orderArray: any = [];
  isLoaded: boolean = false;
  isLoading: boolean = false;

  constructor(
    private orderDataService: OrderDataService
  ) {
    this.fetchOrderData();
  }

  ngOnInit(): void { }

  async fetchOrderData() {
    this.isLoading = true;
    this.isLoaded = false;

    this.orders = await this.orderDataService.getOrderData();
    console.log("Orders: ", this.orders)

    let count: number = 0;
    for (let orderId in this.orders) {
      count++;

      const orderObj: Order = this.orders[orderId];
      const oia = [];

      for (let oi in orderObj.orderedItems) {
        const o = {
          name: orderObj.orderedItems[oi].name,
          price: orderObj.orderedItems[oi].price,
          quantity: orderObj.orderedItems[oi].quantity
        };
        oia.push(o);
      }


      const obj: any = {
        orderNo: count,
        orderId: orderObj.orderId,
        addedOn: orderObj.addedOn,
        isReady: orderObj.isReady,
        orderedItems: oia,
        totalAmt: orderObj.totalAmt
      };

      this.orderArray.push(obj);
    }

    //reverse it to show latest order first
    this.orderArray.reverse();

    this.isLoaded = true;
    this.isLoading = false;
  }

  getItemTotalAmount(price: number, quantity: number) {
    return Number(price) * Number(quantity);
  }

}
