import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { Army } from '@app/services/model';
import { SessionService } from '@services/session/session.service';



@Injectable({
  providedIn: 'root'
})
export class RestoreService {

  private _armiesSubs: Subscription[] = [];
  private _beforeRestore?: Army[];
  private _restorePoint = new Map<string, number>();

  constructor(private session: SessionService) { }


  delete() {
    this._restorePoint = new Map<string, number>();
    this._armiesSubs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Calls the updateArmy function of the active nation for each army with saved changes in the restorePoint to update back to 
   * the army in the beforeRestore array.
   */
  restore() {
    const activeNation = this.session.getActiveNation();
    console.log('Restoring ' + activeNation?.name + '...');
    console.log(this._beforeRestore?.length + ' before entries.');
    console.log(this._restorePoint.size + ' restorePoint entries.');
    if (activeNation) {
      this._restorePoint.forEach((_, name) => {
        const army = this._beforeRestore?.find(a => a.name == name);
        if (army)
          activeNation?.updateArmy(army);
        console.log('Restored', army?.name, ' from', activeNation);
      });
    }
  }

  /**
   * Sets the beforeRestore array and subscribes to all armies$ of the active nation to save changes to them to the restorePoint map.
   */
  set() {
    const activeNation = this.session.getActiveNation();
    if (activeNation) {
      this._beforeRestore = activeNation.armies;
      activeNation.armies$.forEach(obs => this._armiesSubs.push(obs.subscribe(army => {
        const before = this._beforeRestore!.find(bef => bef.name == army.name);
        if (before?.troops != army.troops) {
          if (this._restorePoint.has(army.name))
            this._restorePoint.delete(army.name);
          this._restorePoint.set(army.name, army.troops);
        }
        console.log(`Restore ${before ? 'found' : 'found no'} army: ${army.name}`);
      })));
    }
  }
}
