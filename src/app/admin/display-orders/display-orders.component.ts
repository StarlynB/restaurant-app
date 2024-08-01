import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Order } from 'src/app/models/order.model';
import { OrderDataService } from 'src/app/services/order-data.service';

@Component({
  selector: 'app-display-orders',
  templateUrl: './display-orders.component.html',
  styleUrls: ['./display-orders.component.scss']
})
export class DisplayOrdersComponent implements OnInit {
  orders: any;
  orderArray: any = [];
  isLoading: boolean = true;
  isLoaded: boolean = false;
  userName: string;
  uid: string;
  totalAmount: number = 0; // Propiedad para el total de todos los pedidos

  constructor(
    private orderDataService: OrderDataService,
    private route: ActivatedRoute
  ) {
    this.userName = this.route.snapshot.queryParams['name']
    this.uid = this.route.snapshot.params['uid'];
  }

  ngOnInit(): void {
    this.fetchOrderData();
  }

  async fetchOrderData() {
    this.isLoaded = false;
    this.isLoading = true;

    this.orders = await this.orderDataService.getOrderDataById(
      this.uid
    );

    console.log('Orders fetched:', this.orders);
    let count = 0;
    for (let orderId in this.orders) {
      count++;

      const orderObj: Order = this.orders[orderId];
      const oia = [];

      for (let oi in orderObj.orderedItems) {
        const o = {
          name: orderObj.orderedItems[oi].name,
          price: orderObj.orderedItems[oi].price,
          quantity: orderObj.orderedItems[oi].quantity,
        };
        oia.push(o);
      }

      const obj: any = {
        orderNo: count,
        orderId: orderId,
        addedOn: orderObj.addedOn,
        isReady: orderObj.isReady,
        orderedItems: oia,
        totalAmt: parseFloat(orderObj.totalAmt),
      };

      this.orderArray.push(obj);

      // Sumar el total de cada pedido al total general
      this.totalAmount += parseFloat(orderObj.totalAmt);
    }

    // reverse it to show latest order first
    this.orderArray.reverse();

    this.isLoaded = true;
    this.isLoading = false;
  }

  async updateIsReady(orderId: string, isReady: boolean) {
    const orderToUpdate = this.orders[orderId];

    if (!orderToUpdate) {
      console.error(`Order with ID ${orderId} not found in orders.`);
      return;
    }

    orderToUpdate.isReady = isReady;

    try {
      await this.orderDataService.updateOrderIsReady(this.uid, orderId, orderToUpdate);

      // Update the local order array as well
      const orderIndex = this.orderArray.findIndex((order: { orderId: string; }) => order.orderId === orderId);
      if (orderIndex !== -1) {
        this.orderArray[orderIndex].isReady = isReady;
      }


      setTimeout(() => {
        window.location.reload();
      }, 3000)



    } catch (error) {
      console.error('Error updating order:', error);
    }
  }
  

  getItemTotalAmount(price: number, quantity: number) {
    return Number(price) * Number(quantity);
  }
}
