import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { OAuthToken } from './o-auth-token';
import {isNull} from 'util';

@Injectable({
  providedIn: 'root'
})
export class DomoticaService {

  protected apiUrl: string = 'https://domotica2.localtunnel.me/';
  public isAuthenticated: boolean = false;

  constructor(
      protected http: HttpClient,
      protected storage: Storage,
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

  protected setAuthCredentials(username: string, password: string, token: OAuthToken) {
    this.storage.set('domotica.api.username', username);
    this.storage.set('domotica.api.password', password);
    this.storage.set('domotica.api.token', token);
  }

  updateUser(userdata: object) {
    return new Promise((resolve, reject) => {

      this.storage.get('domotica.api.token').then((token: OAuthToken) => {

        let headers = new HttpHeaders({
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

      this.storage.get('domotica.api.token').then((token: OAuthToken) => {

        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token.token_type + ' ' + token.access_token
        });

        this.http.get(this.apiUrl + 'api/jobs', {headers: headers}).subscribe((response: any) => {
          resolve(response.data);
        }, err => {
          reject(err);
        });

      });
    });

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
        this.setAuthCredentials(username, password, <OAuthToken> data);
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  public logout() {
    return this.storage.clear();
  }

}
