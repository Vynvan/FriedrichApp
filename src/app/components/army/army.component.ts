import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, EMPTY, Observable, Subscription, map } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Army } from '@app/services/model';

@Component({
  selector: 'app-army',
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

  private _army!: Army;
  private _troops: BehaviorSubject<[number, boolean][]>;
  private armySub?: Subscription;


  /**
   * Subscribes to the observable.
   */
  @Input({ required: true }) 
  set army$(a: Observable<Army>) {
    const ar: [number, boolean][] = [];
    if (this.armySub) {
      this.armySub.unsubscribe();
    }
    this.armySub = a.subscribe(newArmy => {
      this._army = newArmy;
      for (let i = 0; i < newArmy.troops; i++) {
        ar.push([i + 1, true]);
      }
      if (this.editMode) {
          for (let i = newArmy.troops; i < newArmy.maxTroops; i++) {
            ar.push([i, false]);
          }
      }
      this._troops.next(ar);
    });
  }

  @Input({ required: false })
  editMode: boolean = false;

  @Output() troopsChanged = new EventEmitter<Army>();


  get name(): string {
    return this._army.name;
  }

  get startsOn(): string {
    return this._army.startsOn;
  }

  get troops(): number {
    return this._army.troops;
  }


  // get name$(): Observable<string> {
  //   return this.army$.pipe(map(a => a.name));
  // }

  // get startsOn$(): Observable<string> {
  //   return this.army$.pipe(map(a => a.startsOn));
  // }

  // get troops$(): Observable<string> {
  //   return this.army$.pipe(map(a => '${a.troops} / ${a.maxTroops}'));
  // }

  get troopStates$(): Observable<[number, boolean][]> {
    return this._troops?.asObservable();
  }


  constructor() {
    const ar: [number, boolean][] = [];
    this._troops = new BehaviorSubject(ar);
  }

  /**
   * Only active in editMode.
   * Changes the clicked troopState icon AND changes the other troopStates accordingly. If the clicked troop was active, it turns into the first inactive. 
   * If it was inactive it becomes the last active. After that, 'submitChange' emits the troopsChanged event.
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
      this.submitChange(troopCount);
    }
  }

  /**
   * Subscribes to the army$ observable, edits the given army and emits if via the troopsChanged event. Unsubcribes after that.
   * @param troopCount 
   */
  private submitChange(troopCount: number) {
      this._army.troops = troopCount;
      this.troopsChanged.emit(this._army);
  }

  ngOnDestroy() {
    this.armySub?.unsubscribe();
  }
}
