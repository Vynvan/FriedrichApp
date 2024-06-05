import { Injectable } from '@angular/core';

import { Army, Nation$ } from '../model';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class BattlePartyService {

  private _nation?: Nation$;
  set nation(value: Nation$) {
    this._nation = value;
  }

  private _party: Army[] = [];
  get party(): Army[] {
    return this._party;
  }
  set party(value: Army[]) {
    this._party = value;
    this.session.saveBattleParty(value);
  }


  constructor(private session: SessionService) {
    this._nation = this.session.activeNation;
    this._party = this.session.getBattleParty();
  }

  
  reset() {
    this._nation = undefined;
    this._party = [];
    this.session.deleteParty();
  }


}
