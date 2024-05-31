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
    this.fromSession();
  }

  
  reset() {
    this._nation = undefined;
    this._party = [];
    this.session.deleteParty();
  }


  private fromSession() {
    this._nation = this.session.getActiveNation();
    const partyStr = this.session.getBattleParty();
    if (partyStr.length > 0) {
      partyStr.forEach(name => {
        const army = this._nation?.armies.find(a => a.name == name);
        if (army)
          this._party.push(army);
      });
    }
  }
}
