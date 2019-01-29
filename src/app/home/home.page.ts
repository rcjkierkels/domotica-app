import { Component } from '@angular/core';
import { DomoticaService } from '../domotica.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public jobs: object[];

  constructor(
      protected domoticaService: DomoticaService
  ) {

    this.domoticaService.getJobs().then((jobs: object[]) => {
      this.jobs = jobs;
    });

  }

  doRefresh(event) {

    this.domoticaService.getJobs().then((jobs: object[]) => {
      this.jobs = jobs;
      event.target.complete();
    });
  }



}
