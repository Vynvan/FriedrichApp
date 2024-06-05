import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';

import { Army, Nation, Nation$ } from '@services/model';
import { NationService } from '@services/nation/nation.service';
import { Subscription } from 'rxjs';



const DUMMY = new Nation$({ armies: [], maxTroops: 0, name: '' });
const SERVER = { active: '', picked: new Array<Nation$>(), state: 0 };


/**
 * Serves all session realated data like the picked nations and army sizes. The data is retrieved from the corresponding services OR the sessionStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {

  private _active?: Nation$;
  private _picked?: Nation$[];
  private isBrowser: boolean;
  private subs: Subscription[] = [];

  get activeNation(): Nation$ {
    if (!this._active)
      this._active = this.getActiveNation();
    return this._active;
  }

  get pickedNations(): Nation$[] {
    if (!this._picked?.length)
      this.pickNations(this.getPicked());
    return this._picked ?? [];
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
      sessionStorage.removeItem('party');
      sessionStorage.removeItem('state');
      this._picked?.forEach(nation => {
        nation.armies.forEach(army => sessionStorage.removeItem(army.name));
      });
    }
    this._picked = [];
    this.ngOnDestroy();
  }

  deleteParty() {
    if (this.isBrowser)
      sessionStorage.removeItem('party');
  }

  getBattleParty(): Army[] {
    const party: Army[] = [];
    if (this.isBrowser) {
      const partyStr = sessionStorage.getItem('party');
      if (this.activeNation && partyStr) {
        partyStr.split(';').forEach(name => {
          if (name.length) {
            const army = this.activeNation.armies.find(a => a.name == name);
            if (army)
              party.push(army);
          }
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
   * Get the state from session or returns 0 (and therefor set the first state).
   * @returns 
   */
  getState(): number {
    if (this.isBrowser) {
      return Number(sessionStorage.getItem('state') ?? 0);
    }
    return SERVER.state;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  pickNations(nations: Nation[]) {
    this._picked = nations.map(nat => {
      const n = new Nation$(nat);
      const sub = n.updated$.subscribe(army => this.saveArmy(army));
      this.subs.push(sub);
      return n;
    });
  }

  saveActive(name: string) {
    this._active = this.getPickedNation(name);
    if (this.isBrowser)
      sessionStorage.setItem('active', name);
    else SERVER.active = name;
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


  private getActiveNation(): Nation$ {
    if (this.isBrowser) {
      const name = sessionStorage.getItem('active');
      if (name)
        return this.getPickedNation(name);
    }
    return SERVER.active ? this.getPickedNation(SERVER.active) : DUMMY;
  }

  private getPickedNation(name: string): Nation$ {
    const n = this.pickedNations.find(n => n.name == name) ?? this.pickedNations[0];
    return n;
  }

  /**
   * Takes the all nations map and picks the players picked nations that are saved in the session.
   * This is supposed to only get called by the nationService.
   * @param all The all nations map of the NationService
   * @returns The picked nations according to session or []
   */
  private getPicked(): Nation[] {
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

  private saveArrayToString(ar: string[], sessionName: string) {
    if (this.isBrowser) {
      let saveStr = '';
      ar.forEach(elem => saveStr += elem + ';');
      sessionStorage.setItem(sessionName, saveStr);
    }
  }
}