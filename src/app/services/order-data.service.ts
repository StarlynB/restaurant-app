import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleLocalStorageService } from './handle-local-storage.service';
import { getDatabase, ref, update } from 'firebase/database';
import { Order } from '../models/order.model';
import { OrderDetails } from '../models/order-details.model';
import { initializeApp } from 'firebase/app';
import { enviroment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderDataService {
  uid: string | null | undefined;
  private db;
  constructor(
    private _http: HttpClient,
    private handleLocalStorageServices: HandleLocalStorageService,
  ) {
    // this.uid = this.handleLocalStorageServices.getuser();
    const app = initializeApp(enviroment.firebase);
    this.db = getDatabase(app)
    this.uid = this.handleLocalStorageServices.getUser();
  }

  /** add item data to Firebase DB */
  addOrderData(orderData: any, totalAmount: string) {
    const orderObj: Order = this.formatOrderData(orderData, totalAmount);
    const path = `${enviroment.firebase.databaseURL}/orders/${this.uid}.json`;
    return this._http.post<Order>(path, orderObj);
  }


  formatOrderData(orderData: any, amount: string): Order {
    let orderDetailsObj = {};

    for (let key in orderData) {
      const _obj: OrderDetails = {
        [orderData[key].id]: {
          itemId: orderData[key].id,
          name: orderData[key].name,
          price: orderData[key].price,
          quantity: orderData[key].quantity,
        },
      };

      orderDetailsObj = {
        ...orderDetailsObj,
        [orderData[key].id]: _obj[orderData[key].id]
      };
    }


    const orderObj: Order = {
      orderId: '',
      orderedItems: orderDetailsObj,
      addedOn: new Date().toLocaleString(),
      isReady: false,
      totalAmt: amount
    };

    return orderObj;
  }

  setOrderId(idParams: string) {
    const orderId = `orderId${idParams}`;
    const orderRef = ref(this.db, `orders/${this.handleLocalStorageServices.getUser()}/${idParams}`);
    update(orderRef, { orderId: orderId });
  }

  async getOrderData() {
    const uid = this.handleLocalStorageServices.getUser();
    const path = `${enviroment.firebase.databaseURL}/orders/${uid}.json`;

    return await this._http.get(path).toPromise();
  }

  async getOrderDataById(uid: string) {
    const path = `${enviroment.firebase.databaseURL}/orders/${uid}.json`;
    console.log(path);
    return await this._http.get(path).toPromise();
  }

  async removeOrderById(uid: string, orderId: string) {
    const path = `${enviroment.firebase.databaseURL}/orders/${uid}/${orderId}.json`;
    console.log('order: ', path);
    try {
      return await this._http.delete(path).toPromise();
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
  

  async updateOrderIsReady(uid: string, orderId: string, orderData: any) {
    const path = ref(this.db, `/orders/${uid}/${orderId}`);
    console.log(path);
    update(path, orderData)
  }


}
