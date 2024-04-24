import { TestBed } from '@angular/core/testing';

import { HideTroopsService } from './hide-troops.service';

describe('HideTroopsService', () => {
  let service: HideTroopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HideTroopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
