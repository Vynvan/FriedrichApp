import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, EMPTY, Observable, Subscription, map } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Army } from '@app/services/model';

@Component({
  selector: 'app-components.army',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './army.component.html',
  styleUrl: './army.component.scss'
})
export class ArmyComponent {

  @Input({ required: true }) 
  army$: Observable<Army> = EMPTY;

  @Input({ required: false })
  editMode: boolean = false;

  @Output() troopsChanged = new EventEmitter<Army>();

  get name$(): Observable<string> {
    return this.army$.pipe(map(a => a.name));
  }

  get startsOn$(): Observable<string> {
    return this.army$.pipe(map(a => a.startsOn));
  }

  get troops$(): Observable<string> {
    return this.army$.pipe(map(a => '${a.troops} / ${a.maxTroops}'));
  }

  private _troops: BehaviorSubject<[number, boolean][]>;
  get troopStates$(): Observable<[number, boolean][]> {
    return this._troops.asObservable() ?? EMPTY;
  }

  private armySub: Subscription;

  constructor() {
    const ar: [number, boolean][] = [];
    this._troops = new BehaviorSubject(ar);
    this.armySub = this.army$.subscribe(newArmy => {
      for (let i = 0; i < newArmy.troops; i++)
        ar.push([i + 1, true]);
      if (this.editMode) {
        for (let i = newArmy.troops; i < newArmy.maxTroops; i++)
          ar.push([i, false]);
      }
      this._troops.next(ar);
    });
  }

  /**
   * Changes the clicked troopState icon AND changes the other troopStates accordingly. If the clicked icon was active, it turns into the first inactive. 
   * If it was inactive it becomes the last active. After adjusting the icons, 'submitChange' emits the troopsChanged event.
   * @param troop 
   */
  onClick(troop: [number, boolean]) {
    if (this.editMode) {
      let troopCount = 0;
      const prev = this._troops.getValue();
      for (let i = 0; i < prev.length; i++) {
        if (prev[i][0] < troop[0])
          prev[i][1] = true;
        else if (prev[i][0] == troop[0]) {
          prev[i][1] = !troop[1];
          troopCount = !troop[1] ? troop[0] : troop[0] - 1;
        }
        else if (prev[i][0] > troop[0])
          prev[i][1] = false;
      }
      this._troops.next(prev);
      this.submitChange(troopCount);
    }
  }

  /**
   * Subscribes to the army$ observable, edits the given army and emits if via the troopsChanged event. Unsubcribes after that.
   * @param troopCount 
   */
  private submitChange(troopCount: number) {
    const sub = this.army$.subscribe(a => {
      a.troops = troopCount;
      this.troopsChanged.emit(a);
      sub.unsubscribe();
    });
  }

  /**
   * Changes the value of exactly one troopState in the array.
   * @param troop 
   */
  private changeTroopState(troop: [number, boolean]) {
    const prev = this._troops.getValue();
    const idx = prev.findIndex(val => val[0] === troop[0]);
    if (idx >= 0) {
      prev[idx][1] = troop[1];
    }
    this._troops.next(prev);
  }

  ngOnDestroy() {
    this.armySub.unsubscribe();
  }
}
