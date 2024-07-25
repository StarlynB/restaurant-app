import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { enviroment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private apiKey = enviroment.apikey;
  private apiUrl = enviroment.apiUrl + `${this.apiKey}/latest/USD`;

  constructor(private http: HttpClient) { }

  getDollarPrice(): Observable<number> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(
        response => response.conversion_rates.DOP
      )
    )
  }
}
