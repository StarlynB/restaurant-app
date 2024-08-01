import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserDataService } from './user-data.service';
import { HandleLocalStorageService } from './handle-local-storage.service';
import { Auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut, signInWithRedirect, getAuth, getRedirectResult } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAutenticated: boolean = false;
  isAuthSub = new BehaviorSubject<any>(null);
  private authStateData: any = null;
  authStateSubject = new BehaviorSubject<any>(null);

  constructor(
    private auth: Auth,
    private router: Router,
    private userDataService: UserDataService,
    private handleLocalStorageService: HandleLocalStorageService
  ) {

    //subscribe to the observable that authState return
    // so that we get updated whenever the authState data gets manipulated
    this.authStateListener();

  }

  private authStateListener() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.handleLocalStorageService.setUser(user.uid);
        this.userDataService.getUserDataFromFirebase();
        // Sync card data
        this.setIsAuthenticated(true);
        this.handleLocalStorageService.setIsAuthenticated('true');
        this.setAuthState(true);
      } else {
        this.setIsAuthenticated(false);
        this.handleLocalStorageService.clearLocalStorage();
      }
    });
  }


  //sign in email or password
  signIn(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  //sign up with email and password
  signUp(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  authenticateWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(this.auth, provider);
  }

  handleRedirectResult() {
    const auth = getAuth();
    return getRedirectResult(auth);
  }

  autoLogin() {
    if (localStorage.getItem('user') != null) {
      this.setIsAuthenticated(true);
      this.handleLocalStorageService.setIsAuthenticated('true');
    }
  }

  logout() {
    signOut(this.auth).then(() => {
      this.handleLocalStorageService.clearLocalStorage();
      this.setIsAuthenticated(false);
      this.setAuthState(null)
      this.router.navigate(['']);
    })
  }

  getIsAuthObservable() {
    this.isAuthSub.next(this.isAutenticated)
  }

  setIsAuthenticated(v: boolean) {
    this.isAutenticated = v;
    this.isAuthSub.asObservable();
  }

  getAuthStateObservable() {
    return this.authStateSubject.asObservable();
  }

  setAuthState(data: any) {
    this.authStateData = data;
    this.authStateSubject.next(this.authStateData);
  }

}
