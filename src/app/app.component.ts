import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DomoticaService } from './domotica.service';
import { PushMessageService } from './push-message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    protected domoticaService: DomoticaService,
    protected router: Router,
    protected pushMessageService: PushMessageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    const self = this;
    this.platform.ready().then(() => {
      this.checkAuthentication().then(function() {
        self.pushMessageService.init().then(function() {
          self.statusBar.styleDefault();
          self.splashScreen.hide();
          self.router.navigate(['/home']);
        }).catch(function(err: string) {
          console.log(err);
          self.statusBar.styleDefault();
          self.splashScreen.hide();
          self.router.navigate(['/home']);
        });
      }).catch(function() {
        self.statusBar.styleDefault();
        self.splashScreen.hide();
        self.router.navigate(['/login']);
      });
    });
  }



  checkAuthentication() {
    const self = this;

    return new Promise((resolve, reject) => {
      this.domoticaService
          .getAuthToken()
          .then(function() {
            self.domoticaService.isAuthenticated =  true;
            resolve();
          })
          .catch(function() {
            self.domoticaService.isAuthenticated =  false;
            reject();
          });
    });
  }
}
