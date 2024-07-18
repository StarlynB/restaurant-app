import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { OrderDataService } from 'src/app/services/order-data.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {
  userData: any;
  userDataArray: any[] = [];

  isLoading: boolean = false;
  isLoaded: boolean = false;

  constructor(
    private userDataService: UserDataService,
    private orderDataService: OrderDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchAllUsersData();
  }

  async fetchAllUsersData() {
    this.isLoading = true;

    this.userData = await this.userDataService.getAllUsersData();
    this.formatUserData();

    this.isLoading = false;
    this.isLoaded = true;
  }

  formatUserData() {
    for (let obj in this.userData) {
      this.userDataArray.push(this.userData[obj]);
    }
  }

  goToOrders(user: User) {
    const navObj: NavigationExtras = {
      queryParams: { name: user.name }
    }
    this.router.navigate(['admin', user.uid, 'orders'], navObj);
  }
}
