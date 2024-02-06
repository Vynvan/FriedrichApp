import { TestBed } from '@angular/core/testing';

import { AppSessionService } from './appSession.service';

describe('AppSessionService', () => {
  let service: AppSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
