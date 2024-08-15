import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { NavigationExtras, Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit{
  usersData: any;
  userDataArray: any[] = [];

  isLoading: boolean =  false;
  isLoaded: boolean = false;
  count: number = 0;


  constructor(
    private userDataService: UserDataService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.fetchAllUsersData();
  }

  async fetchAllUsersData() {
    this.isLoading = true;

    this.usersData =  await this.userDataService.getAllUsersData();
    this.formatUserData();

    this.isLoading = false;
    this.isLoaded = true;
    
  }

  
  formatUserData() {
    
    for (let obj in this.usersData) {
      this.count++;
      this.userDataArray.push(this.usersData[obj]);
      
    }
  }

  goToUser(user: User) {
    const navObj: NavigationExtras = {
      queryParams: { name: user.name }
    }
    this.router.navigate(['admin', user.uid, 'user'], navObj);
  }

}
