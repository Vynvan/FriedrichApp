import { TestBed } from '@angular/core/testing';

import { BattlePartyService } from './battle-party.service';

describe('BattlePartyService', () => {
  let service: BattlePartyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattlePartyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
