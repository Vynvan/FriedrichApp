import { TestBed } from '@angular/core/testing';

import { BattlePartyService } from './battle.service';

describe('BattleService', () => {
  let service: BattlePartyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattlePartyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
