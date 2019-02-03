import { Injectable } from '@angular/core';

import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { isCordovaAvailable } from './common/is-cordova-available';

import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PushMessageService {

  protected oneSignal: OneSignal;

  constructor(protected events: Events) {

    // No provider available so dependency injection not working
    this.oneSignal = new OneSignal();

  }

  public init() {
    return new Promise((resolve, reject) => {
      if (isCordovaAvailable()) {
        this.oneSignal.startInit('ced98ffc-4129-461b-8fd4-e4a91732d8a7', '928989634552');
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
        this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload));
        this.oneSignal.endInit();

        this.oneSignal.getIds().then(identity => {
          resolve(identity);
        }).catch(() => {reject('PushMessage service could not detect device UUID');});
      } else {
        reject('PushMessage service not initialized because not on native device');
      }
    });
  }

  private onPushReceived(payload: OSNotificationPayload) {
    this.events.publish('jobsUpdate', payload.additionalData);
  }

  private onPushOpened(payload: OSNotificationPayload) {
    this.events.publish('jobsUpdate', payload.additionalData);
  }
}
