import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';
import { Order } from '../models/order.model';
import { ActivatedRoute } from '@angular/router';
import { parse, differenceInSeconds, format } from 'date-fns';
import { UserDataService } from '../services/user-data.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit, OnDestroy {
  orders: any;
  orderArray: any = [];
  isLoaded: boolean = false;
  isLoading: boolean = false;
  isCancel: boolean = false
  uid: string | undefined;

  private Subscription: Subscription = new Subscription()

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
  ngOnDestroy(): void {
    this.Subscription.unsubscribe();
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
        this.isCancel = true;
        await this.orderDataService.removeOrderById(this.uid!, orderId);
        this.startLottieTimer()
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

  startLottieTimer() {
    this.Subscription.add(timer(3000).subscribe(() => {
      this.isCancel = false;
    }));
  }
//   convertDateToStandardFormat(addedOn: string): string {
//     const possibleFormats = ['dd/MM/yyyy, HH:mm:ss', 'MM/dd/yyyy, HH:mm:ss'];
//     let parsedDate: Date | null = null;
  
//     // Intentar parsear la fecha usando los formatos posibles
//     for (const formatString of possibleFormats) {
//         parsedDate = parse(addedOn, formatString, new Date());
//         if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
//             break;
//         }
//     }
  
//     // Si se parsea correctamente en uno de los formatos, lo convertimos al formato estándar
//     if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
//         return format(parsedDate, 'MM/dd/yyyy, HH:mm:ss');
//     }
  
//     // Si no se pudo parsear, devolver la fecha original para que se maneje como error en otra parte
//     console.error('Failed to parse date:', addedOn);
//     return addedOn;
// }
  
// calculateRemainingSeconds(addedOn: string): number {
//     const currentTime = new Date();
//     let orderTime = new Date(addedOn);

//     // Verifica si la fecha es válida
//     if (isNaN(orderTime.getTime())) {
//         console.error('Failed to parse date:', addedOn);
//         return 0;
//     }

//     // Realiza el cálculo
//     const totalAllowedSeconds = 20 * 60; // 20 minutos en segundos
//     const timeDifference = Math.max(0, (currentTime.getTime() - orderTime.getTime()) / 1000);

//     return totalAllowedSeconds - timeDifference;
// }
  
// isWithinCancelTime(addedOn: string): boolean {
//     const remainingSeconds = this.calculateRemainingSeconds(addedOn);
//     return remainingSeconds > 0;
// }
  
// updateTimers() {
//     for (let order of this.orderArray) {
//         const newRemainingSeconds = this.calculateRemainingSeconds(order.addedOn);
//         if (order.remainingSeconds !== newRemainingSeconds) {
//             order.remainingSeconds = newRemainingSeconds;
//         }
//     }
// }
  
// formatTime(seconds: number): string {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
// }

convertDateToStandardFormat(addedOn: string): string {
  const date = new Date(addedOn);
  if (isNaN(date.getTime())) {
      console.error('Failed to parse date:', addedOn);
      return addedOn;
  }

  // Formatear la fecha solo para minutos y segundos
  return format(date, 'mm:ss'); // 'mm:ss' para minutos y segundos
}

calculateRemainingSeconds(addedOn: string): number {
  const currentTime = new Date();
  const orderTime = new Date(addedOn);

  if (isNaN(orderTime.getTime())) {
      console.error('Failed to parse date:', addedOn);
      return 0;
  }

  // Calcula la diferencia en segundos
  const totalAllowedSeconds = 20 * 60; // 20 minutos en segundos
  const timeDifference = Math.max(0, (currentTime.getTime() - orderTime.getTime()) / 1000);

  return totalAllowedSeconds - timeDifference;
}

isWithinCancelTime(addedOn: string): boolean {
  const remainingSeconds = this.calculateRemainingSeconds(addedOn);
  return remainingSeconds > 0;
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
  const remainingSeconds = Math.floor(seconds % 60); // Redondea a segundos enteros
  return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
}
