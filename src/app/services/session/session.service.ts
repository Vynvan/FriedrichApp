import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';

import { Nation, Nation$ } from '@services/model';
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
    this.picked.forEach(nation => {
      nation.armies.forEach(army => sessionStorage.removeItem(army.name));
    });
    this.picked = [];
    sessionStorage.removeItem('active');
    sessionStorage.removeItem('hidden');
    sessionStorage.removeItem('nations');
    sessionStorage.removeItem('state');
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

  getHiddenState(): boolean {
    if (this.isBrowser) {
      const save = sessionStorage.getItem('hidden');
      console.log('session gives hidden=' + (save != null && save === 'true'));
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
      let sub = n.updated$.subscribe(army => this.saveArmy(army.name, army.troops));
      this.subs.push(sub);
      return n;
    });
    console.log(`pickNations subscribes to ${this.subs.length} nations.`);
  }

  saveActive(name: string) {
    if (this.isBrowser)
      sessionStorage.setItem('active', name);
  }

  saveArmy(name: string, troops: number) {
    if (this.isBrowser)
      sessionStorage.setItem(name, troops.toString());
  }

  saveHiddenState(value: boolean) {
    if (this.isBrowser)
      sessionStorage.setItem('hidden', String(value));
  }

  saveNations(nations: Nation[], initialArmySave=false) {
    if (this.isBrowser) {
      let names = '';
      nations.forEach(nation => {
        names += nation.name + ';'
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
}