import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { UserDataService } from '../services/user-data.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HandleLocalStorageService } from '../services/handle-local-storage.service';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userProfileForm!: FormGroup;
  private _userDataSub: Subscription | undefined;
  private _userData: User | undefined;
  private pathVar: string = '';
  isAdmin: boolean = false;
  isReadonly: boolean = true;

  isUpdateSuccess: boolean = false;
  isUpdateFailure: boolean = false;


  constructor(
    private _userDataService: UserDataService,
    private router: Router,
    private route: ActivatedRoute,
    private _handlelocalStorageService: HandleLocalStorageService
  ) {
    //get the path variable
    this.pathVar = this.route.snapshot.params['name'];
  }

  ngOnInit(): void {
    //show 404 if profile path name doesn't match logged in user's name
    if (this.pathVar != '' && this.pathVar != undefined) {
      let _name = this.makeProfilePath(
        this._handlelocalStorageService.getUserName()!
      );

      if (this.pathVar != _name) {
        this.router.navigate(['not-found']);
      }
    }

    this._userDataSub = this._userDataService
      .getUserDataObservable()
      .subscribe((data) => {
        this._userData = data;
        console.log('user: ', this._userData);

        if (this._userData != undefined) {
          if (this._userData.name != undefined) {
            this.userProfileForm?.patchValue({
              name: this._userData.name
            })
          }
          if (this._userData.phone != undefined) {
            this.userProfileForm?.patchValue({
              phone: this._userData.phone
            })
          }
          if (this._userData.email != undefined) {
            this.userProfileForm?.patchValue({
              email: this._userData.email
            })
          }
          if (this._userData.address != undefined) {
            this.userProfileForm?.patchValue({
              address: this._userData.address
            })
          }
          if (this._userData.rol.val != undefined) {
            this.userProfileForm?.patchValue({
              rol: this._userData.rol.val
            })
          }

          // Check if the user is an admin
          if (this._userData.rol.val === 'admin') {
            this.isReadonly = false;
            this.isAdmin = true;
            this.userProfileForm.get('rol')?.enable();
          }

        }
      });

    // creating reactive sigup form
    this.userProfileForm = new FormGroup({
      name: new FormControl(this._userData!.name, [Validators.required]),
      phone: new FormControl(this._userData!.phone, [Validators.pattern('^((\\+1-?)|0)?[0-9]{10}$')]),
      email: new FormControl(this._userData!.email),
      address: new FormControl(this._userData!.address),
      rol: new FormControl({ value: '', disabled: true })
    })

  }

  ngOnDestroy(): void {
    this._userDataSub!.unsubscribe();
  }

  onUpdate() {
    // Handle the case when the disabled attribute for submit button is deleted from HTML
    if (this.userProfileForm.invalid) {
      return;
    }

    // Update basic user data
    this._userData!.name = this.userProfileForm.get('name')?.value;
    this._userData!.phone = this.userProfileForm.get('phone')?.value;
    this._userData!.address = this.userProfileForm.get('address')?.value;

    // Check if the current user is admin to update the role
    if (this.isAdmin) {
      this._userData!.rol = this.userProfileForm.get('rol')?.value;
    }

    // Patch the role value in the form
    this.userProfileForm.patchValue({ rol: this._userData!.rol });

    // Set the user ID for updating user data
    this._userDataService.setUid = this._userData!.uid;

    // Update user data in the service
    this._userDataService.updateUserData(this._userData!)
      .then(() => {
        this.isUpdateSuccess = true;
        const _name: string = this.makeProfilePath(this._userDataService.getName!);
        this.router.navigate(['profile', _name]);
      })
      .catch(() => {
        this.isUpdateFailure = true;
      });

    // Reset success/failure indicators after 2 seconds
    setTimeout(() => {
      this.isUpdateFailure = this.isUpdateSuccess = false;
    }, 2000);
  }

  //* utitlities funtions*/

  replaceUndefinedOrNull(v: any): string {
    if (v == undefined || v == null) {
      return ' ';
    }
    return v;
  }




  /** make profile path from name of the user */
  makeProfilePath(v: string) {
    return v.split(' ').join('-');
  }

}
