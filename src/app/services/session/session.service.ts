import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';

import { Army, Nation, Nation$ } from '@services/model';
import { NationService } from '@services/nation/nation.service';
import { Subscription } from 'rxjs';



/**
 * Serves all session realated data like the picked nations and army sizes. The data is retrieved from the corresponding services OR the sessionStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {

  private isBrowser: boolean;
  private picked: Nation$[] = [];
  private subs: Subscription[] = [];

  get pickedNations(): Nation$[] {
    if (this.picked.length == 0)
      this.pickNations(this.getPicked());
    return this.picked;
  }


  constructor(@Inject(PLATFORM_ID) platformId: Object, private nations: NationService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Clears local variables and all entries in session storage.
   */
  delete() {
    this.nations.setAll();
    if (this.isBrowser) {
      sessionStorage.removeItem('active');
      sessionStorage.removeItem('hidden');
      sessionStorage.removeItem('nations');
      sessionStorage.removeItem('state');
      this.picked.forEach(nation => {
        nation.armies.forEach(army => sessionStorage.removeItem(army.name));
      });
    }
    this.picked = [];
    this.ngOnDestroy();
  }

  getActive(): string | null {
    if (this.isBrowser) {
      let active = sessionStorage.getItem('active');
      if (!active && this.picked.length > 0)
        active = this.picked[0].name;
      return active;
    }
    return null;
  }

  getActiveNation(): Nation$ | undefined {
    if (this.isBrowser) {
      const name = this.getActive();
      if (name)
        return this.pickedNations.find(n => n.name === name);
      else if (this.pickedNations.length > 0)
        return this.picked[0];
    }
    return undefined;
  }

  getBattleParty(): string[] {
    const party: string[] = [];
    if (this.isBrowser) {
      const partyStr = sessionStorage.getItem('party');
      if (partyStr) {
        partyStr.split(';').forEach(a => {
          if (a?.length > 0)
            party.push(a);
        });
      }
    }
    return party;
  }

  getHiddenState(): boolean {
    if (this.isBrowser) {
      const save = sessionStorage.getItem('hidden');
      return save != null && save === 'true';
    }
    return false;
  }

  /**
   * Takes the all nations map and picks the players picked nations that are saved in the session.
   * This is supposed to only get called by the nationService.
   * @param all The all nations map of the NationService
   * @returns The picked nations according to session or []
   */
  getPicked(): Nation[] {
    let picked: Nation[] = [];
    if (this.isBrowser) {
      const nationsStr = sessionStorage.getItem('nations');
      if (nationsStr) {
        const all = this.nations.getAll();
        const nationNames = nationsStr.split(';');
        nationNames.forEach(name => {
          let nation = all.get(name);
          if (nation) {
            nation.armies.forEach(army => {
              let save = sessionStorage.getItem(army.name);
              if (save) {
                army.troops = Number(save);
              }
            });
            picked.push(nation);
          }
        });
      }
    }
    return picked;
  }

  /**
   * Get the state from session or returns 0 (and therefor set the first state).
   * @returns 
   */
  getState(): number {
    if (this.isBrowser) {
      return Number(sessionStorage.getItem('state') ?? 0);
    }
    return 0;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  pickNations(nations: Nation[]) {
    this.picked = nations.map(nat => {
      let n = new Nation$(nat);
      let sub = n.updated$.subscribe(army => this.saveArmy(army));
      this.subs.push(sub);
      return n;
    });
  }

  saveActive(name: string) {
    if (this.isBrowser)
      sessionStorage.setItem('active', name);
  }

  saveArmy(army: Army) {
    if (this.isBrowser)
      sessionStorage.setItem(army.name, army.troops.toString());
  }

  saveBattleParty(party: Army[]) {
    this.saveArrayToString(party.map(p => p.name), 'party');
  }

  saveEnemyParty(party: Army[]) {
    this.saveArrayToString(party.map(p => p.name), 'enemyParty');
  }

  saveHiddenState(value: boolean) {
    if (this.isBrowser)
      sessionStorage.setItem('hidden', String(value));
  }

  saveNations(nations: Nation[], initialArmySave=false) {
    if (this.isBrowser) {
      let names = '';
      nations.forEach(nation => {
        names += nation.name + ';';
        if (initialArmySave)
          nation.armies.forEach(a => sessionStorage.setItem(a.name, a.troops.toString()));
      });
      sessionStorage.setItem('nations', names);
    }
  }

  saveState(state: number) {
    if (this.isBrowser)
      sessionStorage.setItem('state', state.toString());
  }


  private saveArrayToString(ar: string[], sessionName: string) {
    if (this.isBrowser) {
      let saveStr = '';
      ar.forEach(elem => saveStr += elem + ';');
      sessionStorage.setItem(sessionName, saveStr);
    }
  }
}