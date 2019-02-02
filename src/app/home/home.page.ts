import { Component, NgZone } from '@angular/core';
import { DomoticaService } from '../domotica.service';
import { LoadingController } from '@ionic/angular';
import { Events } from '@ionic/angular';

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
      protected events: Events,
      protected zone: NgZone,
  ) {

    const self = this;

    this.presentLoading().then(function() {
      self.domoticaService.getJobs().then((jobs: object[]) => {
        self.jobs = jobs;
        self.loadingController.dismiss();
      });
    });

    this.events.subscribe('jobsUpdate', (data) => {
      self.jobs.forEach(function(job, index) {
        let jobsdata = JSON.parse(data.jobs);
        console.log(job, jobsdata);
        jobsdata.forEach(function(jobdata) {
          console.log(jobdata, self.jobs[index]);
          console.log('COMPARE: ', jobdata.job_id, job.id, jobdata.job_id == job.id);
          if (jobdata.job_id == job.id) {
            console.log('OK?', self.jobs[index].state, jobdata.state);
            self.zone.run(() => {
              self.jobs[index].state = jobdata.state;
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

}
