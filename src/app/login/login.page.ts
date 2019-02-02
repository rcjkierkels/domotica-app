import { Component, OnInit } from '@angular/core';
import { DomoticaService } from '../domotica.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

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
          .catch(function(err) {
            self.loadingController.dismiss();
            self.domoticaService.isAuthenticated =  false;
            self.presentAlert();
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

}
