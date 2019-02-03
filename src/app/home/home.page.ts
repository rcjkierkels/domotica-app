import { Component, NgZone } from '@angular/core';
import { DomoticaService } from '../domotica.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public jobs: object[];

  constructor(
      protected domoticaService: DomoticaService,
      protected loadingController: LoadingController,
      protected alertController: AlertController,
      protected events: Events,
      protected zone: NgZone,
  ) {

    this.initDashboard();

  }

  protected initDashboard() {
    const self = this;

    this.presentLoading().then(function() {
      self.domoticaService.getJobs().then((jobs: object[]) => {
        self.jobs = jobs;
        self.loadingController.dismiss();
      }).catch((err: HttpErrorResponse) => {
        self.loadingController.dismiss();
      });
    });

    this.events.subscribe('jobsUpdate', (data) => {
      self.jobs.forEach(function(job: any, index) {
        const jobsdata = JSON.parse(data.jobs);
        jobsdata.forEach(function(jobdata) {
          if (jobdata.job_id === job.id) {
            self.zone.run(() => {
              self.jobs[index]['state'] = jobdata.state;
            });
          }
        });
      });
    });
  }

  doRefresh(event) {

    this.domoticaService.getJobs().then((jobs: object[]) => {
      this.jobs = jobs;
      event.target.complete();
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait while getting running jobs from domotica server',
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
          this.initDashboard();
        }
      }]
    });

    await alert.present();
  }

}
