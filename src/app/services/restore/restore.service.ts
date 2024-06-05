import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { SessionService } from '@services/session/session.service';



@Injectable({
  providedIn: 'root'
})
export class RestoreService {

  private armySub?: Subscription;
  private beforeRestore = new Map<string, number>();
  private restorePoint = new Map<string, number>();


  constructor(private session: SessionService) { }


  delete() {
    this.beforeRestore.clear();
    this.restorePoint.clear();
    this.armySub?.unsubscribe();
  }

  /**
   * Calls the updateArmy function of the active nation for each army with saved changes in the restorePoint to update back to 
   * the army in the beforeRestore array.
   */
  restore() {
    this.armySub?.unsubscribe();
    this.restorePoint.forEach((_, name) => {
      const before = this.beforeRestore.get(name);
      if (before != undefined) {
        const army = this.session.activeNation.armies.find(a => a.name);
        if (army && army.troops != before)
          this.session.activeNation.updateArmy(army);
      }
    });
  }

  /**
   * Sets the beforeRestore array and subscribes to all armies$ of the active nation to save changes to them to the restorePoint map.
   */
  set() {
    this.session.activeNation.armies.forEach(a => this.beforeRestore.set(a.name, a.troops));
    this.armySub = this.session.activeNation.updated$.subscribe(army => {
      const before = this.beforeRestore.get(army.name);
      if (before != undefined && before != army.troops) {
        if (this.restorePoint.has(army.name))
          this.restorePoint.delete(army.name);
        this.restorePoint.set(army.name, army.troops);
      }
    });
  }
}