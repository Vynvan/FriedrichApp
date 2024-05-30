import { Injectable } from '@angular/core';

import { Army, Nation } from '@app/services/model';
import { NationService } from '@app/services/nation/nation.service';
import { SessionService } from '@app/services/session/session.service';



@Injectable({
  providedIn: 'root'
})
export class EnemyService {

  nation?: Nation;
  party: Army[] = [];


  constructor(private nations: NationService, private session: SessionService) { }


  setEnemyNation(value: string) {
    this.nation = this.nations.getAll().get(value);
  }

  setParty(names: string[]) {
    names.forEach(name => {
      if (this.nation?.armies) {
        const army = this.nation.armies.find(a => a.name == name);
        if (army)
          this.party?.push(army);
      }
    });
  }

  reset() {
    this.nation = undefined;
    this.party = [];
  }
}
