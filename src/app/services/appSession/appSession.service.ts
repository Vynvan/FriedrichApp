import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Nation } from '@services/model';



@Injectable({
  providedIn: 'root'
})
export class AppSessionService {

  private isBrowser: boolean;


  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }


  getActive(): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem('active');
    }
    return null;
  }

  /**
   * Takes the all nations map and picks the players picked nations that are saved in the session.
   * This is supposed to only get called by the nationService.
   * @param all The all nations map of the NationService
   * @returns The picked nations according to session or []
   */
  getPicked(all: Map<string, Nation>): Nation[] {
    let picked: Nation[] = [];
    if (this.isBrowser) {
      let nationsStr = sessionStorage.getItem('nations');
      if (nationsStr) {
        let nationNames = nationsStr.split(' ');
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

  saveActive(name: string) {
    sessionStorage.setItem('active', name);
  }

  saveArmy(name: string, troops: number) {
    sessionStorage.setItem(name, troops.toString());
  }

  saveNations(nations: Nation[]) {
    let names = '';
    nations.forEach(nation => names += nation.name + ' ');
    sessionStorage.setItem('nations', names);
  }

  saveState(state: number) {
    sessionStorage.setItem('state', state.toString());
  }
}