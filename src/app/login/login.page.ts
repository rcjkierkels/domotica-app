import { Component, OnInit } from '@angular/core';
import { DomoticaService } from '../domotica.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: any = {username: '', password: ''};

  constructor(
      protected domoticaService: DomoticaService,
      protected loadingController: LoadingController,
      protected alertController: AlertController,
      protected storage: Storage,
      protected router: Router
  ) {
  }

  ngOnInit() {
  }

  onSubmit() {
    const self = this;
    this.presentLoading().then(function() {

      self.domoticaService
          .doAuthentication(self.loginForm.username, self.loginForm.password)
          .then(function(data) {
            self.loadingController.dismiss();
            self.domoticaService.isAuthenticated =  true;
            self.router.navigate(['/home']);
          })
          .catch(function(err: HttpErrorResponse) {
            self.loadingController.dismiss();
            self.domoticaService.isAuthenticated =  false;
            console.log('HELENE: ', err);
            if (err.status === 400 || err.status === 401) {
              self.presentAlert();
            } else {
              self.presentConnectionIssueAlert();
            }
          });
    });

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Login failed',
      message: 'The combination of username and password is incorrect.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait',
    });
    return await loading.present();
  }

  protected async presentConnectionIssueAlert() {
    const alert = await this.alertController.create({
      header: 'Connection issue',
      subHeader: 'Connecting to domotica server failed',
      message: 'Please check your internet connection. Cannot connect to domotica server on ' + this.domoticaService.apiUrl,
      buttons:  [{
        text: 'Retry',
        handler: () => {
          this.onSubmit();
        }
      }]
    });

    await alert.present();
  }

}
