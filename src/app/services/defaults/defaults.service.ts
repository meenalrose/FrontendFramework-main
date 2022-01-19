import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class DefaultsService {

  constructor(
    private _api: ApiService,
    private _token: TokenService,
    private http: HttpClient
  ) { }

  listResponseTypes() {
    return this.http.get(`${this._api.baseUrl}appDefaults/responseTypes`,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: this._token.getToken(),
        }),
      })
      .pipe(catchError(this._api.handleError('listResponseTypes', [])));
  }
}
