import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserDataService } from 'src/app/services/user-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-display-user',
  templateUrl: './display-user.component.html',
  styleUrls: ['./display-user.component.scss']
})
export class DisplayUserComponent implements OnInit {
  usersArray: User[] = [];  // Cambiado a un array de User
  isLoading: boolean = false;
  isLoaded: boolean = false;
  userName: string | undefined;
  uid: string | undefined;
  roles: string[] = ['admin','customer'];

  constructor(
    private userDataService: UserDataService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.userName = this.route.snapshot.queryParams['name'];
    this.uid = this.route.snapshot.params['uid'];
  }

  ngOnInit(): void {
    this.fetchUserData();
  }

  async fetchUserData() {
    this.isLoading = true;
    this.isLoaded = false;
  
    try {
      const userResponse = await this.userDataService.getUserById(this.uid!);
  
      if (userResponse) {
        const user: User = userResponse as User; // Aseguramos que es del tipo User
        this.usersArray.push(user);
      } else {
        console.error(`No user found with ID ${this.uid}`);
      }
  
      this.isLoaded = true;
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching user data:', error);
      this.isLoading = false;
    }
  }

  async updateUserRole(user:User) {
    try{
      await this.userDataService.updateUserRole(user.uid, user.rol.val);
      Swal.fire({
        title: 'Role Updated Succefully',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true
      })
      console.log('user rol updated succefully');
    }catch(error) {
      console.log(error)
    }
  }

  removeUser(user: User) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete user'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('User deleted:', this.uid!);
        this.userDataService.removeUser(this.uid!);
        Swal.fire({
          title:'Deleted!',
          text:'The user has been deleted.',
          icon:'success',
          timerProgressBar: true,
          timer: 3000
      });
      this.router.navigate(['admin/manage-users'])
      }
    });
  }
  
}
