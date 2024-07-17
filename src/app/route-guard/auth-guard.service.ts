import { Injectable } from '@angular/core';
import { HandleLocalStorageService } from '../services/handle-local-storage.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private handleLocalStorage: HandleLocalStorageService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if (
      this.handleLocalStorage.getIsAuthenticated() === 'false' ||
      this.handleLocalStorage.getIsAuthenticated() == null
    ) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
}
