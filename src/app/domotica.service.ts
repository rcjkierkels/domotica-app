import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AlertController, Events} from '@ionic/angular';

import { OAuthToken } from './o-auth-token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DomoticaService {

  public apiUrl = 'https://domotica2.localtunnel.me/';
  public isAuthenticated = false;

  constructor(
      protected http: HttpClient,
      protected storage: Storage,
      protected router: Router,
      protected alertController: AlertController,
      protected events: Events
  ) {

  }

  doAuthentication(username: string, password: string) {
    return this.getAuthTokenFromApi(username, password);

  }

  public getAuthToken() {
    return new Promise( (resolve, reject ) => {
      this.storage.get('domotica.api.token').then((token: OAuthToken) => {
        if (!token) {
          reject();
        }
        resolve(token);
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  }

  protected setAuthCredentials(token: OAuthToken) {
    this.storage.set('domotica.api.token', token);
  }

  updateUser(userdata: object) {
    return new Promise((resolve, reject) => {

      this.storage.get('domotica.api.token').then((token: OAuthToken) => {

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token.token_type + ' ' + token.access_token
        });

        this.http.post(this.apiUrl + 'api/users', userdata, {headers: headers}).subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });

      });
    });
  }

  getJobs() {

    return new Promise((resolve, reject) => {

      this.getAuthToken().then((token: OAuthToken) => {

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token.token_type + ' ' + token.access_token
        });

        this.http.get(this.apiUrl + 'api/jobs', {headers: headers}).subscribe((response: any) => {
          resolve(response.data);
        }, err => {
          this.handleApiErrors(err);
          reject(err);
        });

      });
    });

  }

  protected handleApiErrors(err: HttpErrorResponse) {
    switch (err.status) {
      case 401:
        this.router.navigate(['/login']);
        break;
      default:
        console.log(err);
    }
  }

  protected getAuthTokenFromApi(username: string, password: string) {

    const body = {
      grant_type: 'password',
      client_id: 2,
      client_secret: 'hk474tTuE7B0fg9PUENPoOtYBZ6g10KeVJGBCv5a',
      username: username,
      password: password
    };

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'oauth/token', body, {headers: headers}).subscribe(data => {
        this.setAuthCredentials(<OAuthToken> data);
        resolve(data);
      }, (err: HttpErrorResponse) => {
        reject(err);
      });
    });
  }

  public logout() {
    return this.storage.clear();
  }

}
