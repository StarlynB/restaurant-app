import { Component, OnInit } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';
import { Order } from '../models/order.model';
import { ActivatedRoute } from '@angular/router';
import { parse, differenceInSeconds } from 'date-fns';
import { UserDataService } from '../services/user-data.service';

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
  uid: string | undefined;

  constructor(
    private orderDataService: OrderDataService,
    private userDataService: UserDataService,
    private route: ActivatedRoute
  ) {
    this.userDataService.getUserDataObservable().subscribe((data) => {
      this.uid = data.uid!;
    })
     
  }

  ngOnInit(): void {
    this.fetchOrderData();
    setInterval(() => this.updateTimers(), 1000);
  }

  async fetchOrderData() {
    this.isLoading = true;
    this.isLoaded = false;

    try {
      this.orders = await this.orderDataService.getOrderData();
      console.log("Orders: ", this.orders);

      let count = 0;
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
          orderId: orderId,
          addedOn: orderObj.addedOn,
          isReady: orderObj.isReady,
          orderedItems: oia,
          totalAmt: orderObj.totalAmt,
          remainingSeconds: this.calculateRemainingSeconds(orderObj.addedOn)
        };

        this.orderArray.push(obj);
      }

      // Invertir el orden para mostrar la orden más reciente primero
      this.orderArray.reverse();

    } catch (error) {
      console.error('Error fetching order data:', error);
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
    }
  }

  getItemTotalAmount(price: number, quantity: number) {
    return Number(price) * Number(quantity);
  }

  prepareAndRemoveOrderId(rawOrderId: string, addedOn: string) {
    const orderId = rawOrderId.replace(/^orderId/, '');
    this.removeOrderId(orderId, addedOn);
  }

  async removeOrderId(orderId: string, addedOn: string) {
    const orderToRemove = this.orders[orderId];

    if (!orderToRemove) {
      console.error(`Order with ID ${orderId} not found in orders`);
      return;
    }

    if (this.isWithinCancelTime(addedOn)) {
      try {
        await this.orderDataService.removeOrderById(this.uid!, orderId);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error('Error removing order:', error);
      }
    } else {
      console.error('Cannot cancel the order after 5 minutes of its creation');
    }
  }

  isWithinCancelTime(addedOn: string): boolean {
    const remainingSeconds = this.calculateRemainingSeconds(addedOn);
    return remainingSeconds > 0;
  }

  calculateRemainingSeconds(addedOn: string): number {
    const currentTime = new Date();
    const orderTime = parse(addedOn, 'd/M/yyyy, HH:mm:ss', new Date());

    if (isNaN(orderTime.getTime())) {
      console.error('Invalid orderTime:', addedOn);
      return 0;
    }

    const totalAllowedSeconds = 20 * 60; // 5 minutos en segundos
    const timeDifference = differenceInSeconds(currentTime, orderTime);

    return totalAllowedSeconds - timeDifference;
  }

  updateTimers() {
    for (let order of this.orderArray) {
      const newRemainingSeconds = this.calculateRemainingSeconds(order.addedOn);
      if (order.remainingSeconds !== newRemainingSeconds) {
        order.remainingSeconds = newRemainingSeconds;
      }
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
}
