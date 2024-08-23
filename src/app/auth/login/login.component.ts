import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getAdditionalUserInfo } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { AuthErrorHandlerService } from 'src/app/services/auth-error-handler.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  email!: string;
  password!: string;

  errorObj: any;
  isLoggingIn: boolean = false;
  isBtnClicked: boolean = false;
  isHideResponseErrors: boolean = true;
  errorSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private authErrorHandler: AuthErrorHandlerService,
    private userDataService: UserDataService
  ) {
    this.errorSub = authErrorHandler.getErrorObservable().subscribe((data) => {
      this.errorObj = data;
    });

    this.authErrorHandler.initializeErrorObj();
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });

    this.errorObj = {
      logIn: {
        errorFound: null,
        email: null,
        password: null,
        unknown: null
      },
      signUp: {
        errorFound: null,
        name: null,
        email: null,
        password: null,
        unknown: null
      }
    };
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  onLogIn() {
    if (this.loginForm?.invalid) {
      return;
    }

    this.isBtnClicked = true;
    this.isLoggingIn = true;

    this.email = this.loginForm?.get('email')?.value;
    this.password = this.loginForm?.get('password')?.value;

    this.authService.signIn(this.email!, this.password!).then((result) => {
      this.isLoggingIn = false;
      this.isHideResponseErrors = true;

      this.router.navigate(['']);
    })
      .catch((error) => {
        console.log(error);
        this.isBtnClicked = false;
        this.isHideResponseErrors = false;
        this.isLoggingIn = false;
        this.authErrorHandler.handleAuthError(error, 'logIn');
      });
  }

  onLogInWithGoogle() {
    this.authService
      .authenticateWithGoogle()
      .then((result) => {

        const user = result.user;
        const additionalUserInfo = getAdditionalUserInfo(result)
        //save user data only the first time
        if (additionalUserInfo && user) {
          this.userDataService.createNewUser(
            user.displayName,
            user.email,
            user.uid
          )
        }
        setTimeout(() => {
          this.router.navigate(['']);
        }, 1500);

        this.router.navigate(['']);
      })
      .catch((error) => {
        console.log(error);
        this.authErrorHandler.handleAuthError(error, 'logIn');
      });
  }

  hideResponseErrors() {
    if (
      this.authErrorHandler.foundLogInError() &&
      this.isHideResponseErrors === false
    ) {
      this.isHideResponseErrors = !this.isHideResponseErrors;
      this.authErrorHandler.clearLogInError();
    }
  }

  clearLogInErrors() {
    this.errorObj['logIn']['email'] = null;
    this.errorObj['logIn']['password'] = null;
    this.errorObj['logIn']['unknown'] = null;
  }
}
