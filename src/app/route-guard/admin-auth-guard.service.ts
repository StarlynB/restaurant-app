import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { HandleLocalStorageService } from '../services/handle-local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuardService implements CanActivate {
  constructor(
    private handleLocalStorage: HandleLocalStorageService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if (
      this.handleLocalStorage.getIsAdmin() == 'false' ||
      this.handleLocalStorage.getIsAdmin() == null
    ) {
      this.router.navigate(['not-found']);
      return false;
    }

    return true;
  }
}
