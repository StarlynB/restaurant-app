import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserDataService } from './services/user-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'App-Restaurant';

  constructor(
    private authService: AuthService,
    private user: UserDataService
  ) { }

  // auto log in user if local storage has the uid returned by firebase
  ngOnInit(): void {
    this.authService.autoLogin();

  }
}
