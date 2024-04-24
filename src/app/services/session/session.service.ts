import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

import { Nation, Nation$ } from '@services/model';
import { NationService } from '@services/nation/nation.service';



/**
 * Serves all session realated data like the picked nations and army sizes. The data is retrieved from the corresponding services OR the sessionStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private isBrowser: boolean;
  private picked: Nation$[] = [];

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
    this.picked.forEach(nation => {
      nation.armies.forEach(army => sessionStorage.removeItem(army.name));
    });
    this.picked = [];
    sessionStorage.removeItem('active');
    sessionStorage.removeItem('nations');
    sessionStorage.removeItem('state');
  }

  getActive(): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem('active');
    }
    return null;
  }

  getHiddenState(): boolean {
    if (this.isBrowser) {
      return Boolean(sessionStorage.getItem('hidden'));
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
      let nationsStr = sessionStorage.getItem('nations');
      if (nationsStr) {
        let all = this.nations.getAll();
        let nationNames = nationsStr.split(';');
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

  pickNations(nations: Nation[]) {
    this.picked = nations.map(nat => {
      let n = new Nation$(nat);
      n.updated.subscribe(army => this.saveArmy(army.name, army.troops));
      return n;
    });
    this
  }

  saveActive(name: string) {
    sessionStorage.setItem('active', name);
  }

  saveArmy(name: string, troops: number) {
    sessionStorage.setItem(name, troops.toString());
  }

  saveHiddenState(value: boolean) {
    sessionStorage.setItem('hidden', String(value));
  }

  saveNations(nations: Nation[]) {
    let names = '';
    nations.forEach(nation => names += nation.name + ';');
    sessionStorage.setItem('nations', names);
  }

  saveState(state: number) {
    sessionStorage.setItem('state', state.toString());
  }
}