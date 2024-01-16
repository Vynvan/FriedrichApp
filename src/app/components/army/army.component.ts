import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
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
  private _armyMax!: number;
  private _armyMax$!: Observable<[Army, number]>;
  private armySub?: Subscription;
  private troopsSubj: Subject<[number, boolean][]>;

  @Input({ required: true })
  set armyMax$(a: Observable<[Army, number]>) {
    this._armyMax$ = a;
  }

  @Input({ required: false })
  editMode = false;

  @Output() troopsChanged;

  get army$(): Observable<Army> {
    return this._armyMax$.pipe(map(([army, _]) => army));
  }

  get name$(): Observable<string> {
    return this.army$.pipe(map(a => a.name));
  }

  get startsOn$(): Observable<string> {
    return this.army$.pipe(map(a => a.startsOn));
  }

  get troopString$(): Observable<string> {
    return this.army$.pipe(map(army => `${army.troops} / ${army.maxTroops}`));
  }

  get troopStates$(): Observable<[number, boolean][]> {
    return this.troopsSubj.asObservable();
  }


  constructor() {
    this.troopsChanged = new EventEmitter<Army>();
    this.troopsSubj = new ReplaySubject<[number, boolean][]>(1);
  }

  /**
   * Subscribes to the army observable, so whenever army$ changes, a new troopstate is computed here and updated via the troopsSubj.
   */
  ngOnInit() {
    this.armySub = this._armyMax$.subscribe(([newArmy, max]) => {
        const ar: [number, boolean][] = [];
      this._army = newArmy;
      this._armyMax = this._army.troops + max;
      for (let i = 1; i <= newArmy.maxTroops; i++) {
        if (i <= newArmy.troops) {
          ar.push([i, true]);
        }
        else if (this.editMode && (this._armyMax - i) >= 0) {
          ar.push([i, false]);
        }
        else break;
      }
      console.log(`${newArmy.name} gets ${newArmy.troops} troops. Edit is ${this.editMode}. max is ${this._armyMax}\n` + ar);
      this.troopsSubj.next(ar);
    });
  }

  /**
   * Only active in editMode and for all icons but the first.
   * Computes the new troopCount according to the following conditions: If the clicked icon represents the last troop, its state gets switched, 
   * otherwise the clicked icon becomes the last icon with the true state.
   * @param troop 
   */
  onClick(troop: [number, boolean]) {
    if (this.editMode && troop[0] > 1) {
      let troopCount: number;
      let troopMax = this._armyMax < this._army.maxTroops ? this._armyMax : this._army.maxTroops;
      if (troop[0] == troopMax) {
        troopCount = troop[1] ? troop[0]-1 : troop[0];
      }
      else {
        troopCount = troop[0];
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
