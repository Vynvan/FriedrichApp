import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { Army } from '@app/services/model';
import { SessionService } from '@services/session/session.service';



@Injectable({
  providedIn: 'root'
})
export class RestoreService {

  private armySub?: Subscription;
  private beforeRestore?: Army[];
  private restorePoint = new Map<string, number>();


  constructor(private session: SessionService) { }


  delete() {
    this.restorePoint = new Map<string, number>();
    this.armySub?.unsubscribe();
  }

  /**
   * Calls the updateArmy function of the active nation for each army with saved changes in the restorePoint to update back to 
   * the army in the beforeRestore array.
   */
  restore() {
    this.armySub?.unsubscribe();
    const activeNation = this.session.getActiveNation();
    console.log('Restoring ' + activeNation?.name + '...');
    console.log(`${this.beforeRestore?.length} before-entries, ${this.restorePoint.size} restorePoint-entries.`);
    if (activeNation) {
      this.restorePoint.forEach((_, name) => {
        const army = this.beforeRestore?.find(a => a.name === name);
        if (army)
          activeNation.updateArmy(army);
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
      this.beforeRestore = activeNation.armies;
      this.armySub = activeNation.updated$.subscribe(army => {
        const before = this.beforeRestore?.find(ba => ba.name === army.name);
        console.log(`Set restore point for ${army.name} from ${before?.troops} to ${army.troops}.`)
        if (before && before.troops != army.troops) {
          if (this.restorePoint.has(army.name))
            this.restorePoint.delete(army.name);
          this.restorePoint.set(army.name, army.troops);
        }
      });
      // activeNation.armies$.forEach(obs => this._armiesSubs.push(obs.subscribe(army => {
      //   const before = this._beforeRestore!.find(bef => bef.name == army.name);
      //   if (before?.troops != army.troops) {
      //     if (this._restorePoint.has(army.name))
      //       this._restorePoint.delete(army.name);
      //     this._restorePoint.set(army.name, army.troops);
      //   }
      //   console.log(`Restore ${before ? 'found' : 'found no'} army: ${army.name}`);
      // })));
    }
  }
}