import { TestBed } from '@angular/core/testing';

import { DomoticaService } from './domotica.service';

describe('DomoticaServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DomoticaService = TestBed.get(DomoticaService);
    expect(service).toBeTruthy();
  });
});
