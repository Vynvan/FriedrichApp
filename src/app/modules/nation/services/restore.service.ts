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
    const activeNation = this.session.pickedNations.find(n => n.name === this.session.getActive());
    if (activeNation) {
      this._restorePoint.forEach((troops, name) => {
        let army = this._beforeRestore?.find(a => a.name == name);
        if (army) activeNation?.updateArmy(army);
      });
    }
  }

  /**
   * Sets the beforeRestore array and subscribes to all armies$ of the active nation to save changes to them to the restorePoint map.
   */
  set() {
    const activeNation = this.session.pickedNations.find(n => n.name === this.session.getActive());
    if (activeNation) {
      this._beforeRestore = activeNation.armies;
      activeNation.armies$.forEach(obs => this._armiesSubs.push(obs.subscribe(army => {
        const before = this._beforeRestore!.find(bef => bef.name == army.name);
        if (before && before.troops != army.troops) {
          if (this._restorePoint.has(army.name)) this._restorePoint.delete(army.name);
          this._restorePoint.set(army.name, army.troops);
        }
      })));
    }
  }
}
