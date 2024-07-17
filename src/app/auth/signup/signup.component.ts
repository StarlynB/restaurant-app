import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getAdditionalUserInfo } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { AuthErrorHandlerService } from 'src/app/services/auth-error-handler.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  signUpForm!: FormGroup;
  name!: string;
  email!: string;
  password!: string;

  errorObj: any;
  isSigningUp: boolean = false;
  isBtnClicked: boolean = false;
  isHideResponseErrors: boolean = true;
  errorSub: Subscription;
  isSignedUp: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private authErrorHandler: AuthErrorHandlerService,
    private userDataService: UserDataService
  ) {
    // creating a subscription to listen to the subject in authService
    // so that we get updated whenever the errorObj changes
    this.errorSub = authErrorHandler.getErrorObservable().subscribe((data) => {
      this.errorObj = data;
    });

    // calls the next method on subject in authService
    // and we get the errorObj data here
    this.authErrorHandler.initializeErrorObj();
  }


  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    })

    // reset the errorObj
    // so that previous errors don't come up in view 
    this.errorObj = {
      logIn: {
        errorFound: null,
        email: null,
        password: null,
        unknown: null,
      },
      signUp: {
        errorFound: null,
        name: null,
        email: null,
        password: null,
        unknown: null,
      },
    };
  }


  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }


  /** method binded to form ngSubmit event */
  onSignUp() {
    //handle the case when disbled atribute for submit button is deleted
    //from html
    if (this.signUpForm.invalid) {
      return;
    }

    this.isBtnClicked = true;
    this.isSigningUp = true;

    this.name = this.signUpForm.get('name')?.value;
    this.email = this.signUpForm.get('email')?.value;
    this.password = this.signUpForm.get('password')?.value;

    this.authService
      .signUp(this.email, this.password)
      .then((result) => {
        this.isSignedUp = true;
        this.isSigningUp = false;

        this.userDataService.createNewUser(
          this.name,
          this.email,
          result.user.uid
        );

        setTimeout(() => {
          this.router.navigate(['']);
        }, 1500);
      })
      .catch((error) => {
        this.isSignedUp = false;
        this.isSigningUp = false;
        this.isBtnClicked = false;
        this.isHideResponseErrors = false;

        this.authErrorHandler.handleAuthError(error, 'signUp');
      })

  }

  /** on clicking sign up with google */
  onSignUpWithGoogle() {
    this.authService
      .authenticateWithGoogle()
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential!.accessToken;
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
      })
      .catch((error) => {
        this.authErrorHandler.handleAuthError(error, 'signUp');
      })
  }

  /** hides error message in input click */
  hideResponseErrors() {
    if (
      this.authErrorHandler.foundSignUpError() && this.isHideResponseErrors === false
    ) {
      this.isHideResponseErrors = !this.isHideResponseErrors;
      this.authErrorHandler.clearSignUpError();
    }
  }

}
