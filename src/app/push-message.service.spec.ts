import { TestBed } from '@angular/core/testing';

import { PushMessageService } from './push-message.service';

describe('PushMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PushMessageService = TestBed.get(PushMessageService);
    expect(service).toBeTruthy();
  });
});
