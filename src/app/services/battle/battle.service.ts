import { Injectable } from '@angular/core';

import { Army, Nation$ } from '../model';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class BattleService {

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

  
  add(army: Army) {
    if (!this._party.includes(army))
      this._party.push(army);
  }

  remove(army: Army) {
    if (this._party.includes(army))
      this._party.splice(this._party.indexOf(army), 1);
  }

  reset() {
    this._nation = undefined;
    this._party = [];
    this.session.deleteParty();
  }


}
