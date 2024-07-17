import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface AuthErrorLogIn {
  errorFound: boolean;
  email: string | null;
  password: string | null;
  unknown: string | null;
}

interface AuthErrorSignUp {
  errorFound: boolean;
  name: string | null;
  email: string | null;
  password: string | null;
  unknown: string | null;
}

interface AuthErrorObj {
  logIn: AuthErrorLogIn;
  signUp: AuthErrorSignUp;
}

@Injectable({
  providedIn: 'root'
})
export class AuthErrorHandlerService {
  private errorSubject = new Subject<AuthErrorObj>();

  private errorObj: AuthErrorObj = {
    logIn: {
      errorFound: false,
      email: null,
      password: null,
      unknown: null
    },
    signUp: {
      errorFound: false,
      name: null,
      email: null,
      password: null,
      unknown: null
    }
  }

  constructor() { }

  getErrorObservable() {
    return this.errorSubject.asObservable();
  }

  initializeErrorObj() {
    this.errorSubject.next(this.errorObj);
  }

  foundLogInError() {
    return this.errorObj.logIn.errorFound;
  }

  foundSignUpError() {
    return this.errorObj.signUp.errorFound;
  }

  handleAuthError(errorParam: { code: string; message: string }, callerParam: 'logIn' | 'signUp') {
    if (callerParam === 'logIn') {
      this.errorObj.logIn.errorFound = true;

      switch (errorParam.code) {
        case 'auth/invalid-credential':
          this.errorObj.logIn.email = 'Email not registered';
          break;
        case 'auth/wrong-password':
          this.errorObj.logIn.password = 'Password incorrect';
          break;
        default:
          this.errorObj.logIn.unknown = errorParam.message;
          break;
      }

    } else if (callerParam === 'signUp') {
      this.errorObj.signUp.errorFound = true;

      switch (errorParam.code) {
        case 'auth/email-already-in-use':
          this.errorObj.signUp.email = 'Email already in use';
          break;
        case 'auth/invalid-email':
          this.errorObj.signUp.email = 'Please enter a valid email address';
          break;
        default:
          this.errorObj.signUp.unknown = errorParam.message;
          break;
      }
    }

    this.errorSubject.next(this.errorObj);
  }

  clearLogInError() {
    this.errorObj.logIn.errorFound = false;
    this.errorObj.logIn.email = null;
    this.errorObj.logIn.password = null;
    this.errorObj.logIn.unknown = null;

    this.errorSubject.next(this.errorObj);
  }

  clearSignUpError() {
    this.errorObj.signUp.errorFound = false;
    this.errorObj.signUp.name = null;
    this.errorObj.signUp.email = null;
    this.errorObj.signUp.password = null;
    this.errorObj.signUp.unknown = null;

    this.errorSubject.next(this.errorObj);
  }
}