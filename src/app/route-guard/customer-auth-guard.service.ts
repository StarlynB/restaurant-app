import { Injectable } from '@angular/core';
import { HandleLocalStorageService } from '../services/handle-local-storage.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CustomerAuthGuardService implements CanActivate {

  constructor(
    private handleLocalStorage: HandleLocalStorageService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if (
      this.handleLocalStorage.getIsAdmin() == 'true' ||
      this.handleLocalStorage.getIsAdmin() == null
    ) {
      this.router.navigate(['not-found']);
      return false;
    }

    return true;
  }
}
