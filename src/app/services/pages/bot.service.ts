import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class BotService {

  constructor(
    private _api: ApiService,
    private _token: TokenService,
    private http: HttpClient
  ) { }

  show(botId: number) {
    return this.http
      .get(`${this._api.baseUrl}bots/${botId}`, {
        headers: new HttpHeaders({
          Authorization: this._token.accessToken,
          Accept: 'application/json',
        }),
      })
      .pipe(catchError(this._api.handleError('showBots', [])));
  }

  fetchBots(clientId: number) {
    return this.http
      .get(`${this._api.baseUrl}bots?clientId=${clientId}`, {
        headers: new HttpHeaders({
          Authorization: this._token.accessToken,
          Accept: 'application/json',
        }),
      })
      .pipe(catchError(this._api.handleError('fetchBots', [])));
  }

  listBots(args: {
    clientId: number,
    sortBy?: string,
    sortOrder?: string,
    limit: number,
    page: number,
    search: string,
  }) {
    let params = `?clientId=${args.clientId}`;
    params += args.sortBy ? `&sortBy=${args.sortBy}` : ``;
    params += args.sortOrder ? `&sortOrder=${args.sortOrder}` : ``;
    params += `&limit=${args.limit}`;
    params += `&page=${args.page}`;
    params += `&search=${args.search}`;

    return this.http
      .get(`${this._api.baseUrl}bots/paginate${params}`, {
        headers: new HttpHeaders({
          Authorization: this._token.accessToken,
          Accept: 'application/json',
        }),
      })
      .pipe(catchError(this._api.handleError('listBots', [])));
  }

  store(form: FormGroup) {
    return this.http
      .post(
        `${this._api.baseUrl}bots`,
        form.value,
        {
          headers: new HttpHeaders({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: this._token.getToken(),
          }),
        }
      )
      .pipe(catchError(this._api.handleError('storeBot', [])));
  }

  update(form: FormGroup, id: number) {
    return this.http
      .patch(
        `${this._api.baseUrl}bots/${id}`,
        form.value,
        {
          headers: new HttpHeaders({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: this._token.getToken(),
          }),
        }
      )
      .pipe(catchError(this._api.handleError('updateKeyword', [])));
  }

  toggleBlock(id: number) {
    return this.http
      .patch(
        `${this._api.baseUrl}bots/toggleBlock/${id}`,
        {},
        {
          headers: new HttpHeaders({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: this._token.getToken(),
          }),
        }
      )
      .pipe(catchError(this._api.handleError('toggleBlockKeyword', [])));
  }

  delete(id: number) {
    return this.http
      .delete(
        `${this._api.baseUrl}bots/${id}`,
        {
          headers: new HttpHeaders({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: this._token.getToken(),
          }),
        }
      )
      .pipe(catchError(this._api.handleError('deleteBot', [])));
  }
}
