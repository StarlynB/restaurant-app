import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchHeaderImageService {

  constructor(private _http: HttpClient) { }

  fetchImage() {
    return this._http.get(enviroment.UNSPLASH_SOURCE_API)
  }
}
