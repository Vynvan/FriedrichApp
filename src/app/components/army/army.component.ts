import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, of, Subject, Subscription } from 'rxjs';

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

  private allowEdit = false;
  private army!: Army;
  private combineSub?: Subscription;
  private editSubj: BehaviorSubject<boolean>;
  private maxTroopsSub?: Subscription;
  private maxTroopsSubj: Subject<number>;
  private troopsSubj: BehaviorSubject<[number, boolean][]>;


  /**
   * Combines the given army$ observable, the editMode subject, the maxTroops$ observable and subscribes, so whenever editMode or army$ changes, 
   * a new troopstate is computed here and updated via the troopsSubj.
   */
  // @Input({ required: true }) 
  // set army$max$(a: [Observable<Army>, Observable<number>]) {
  //   if (this.combineSub) {
  //     this.combineSub.unsubscribe();
  //   }
  //   this.combineSub = combineLatest([this.editSubj.asObservable(), ...a]).subscribe(([edit, newArmy, max]) => {
  //     const ar: [number, boolean][] = [];
  //     this.allowEdit = edit;
  //     this.army = newArmy;
  //     for (let i = 1; i <= newArmy.maxTroops; i++) {
  //       if (i <= newArmy.troops) {
  //         ar.push([i, true]);
  //       }
  //       else if (edit && (max - i) > 0) {
  //         ar.push([i, false]);
  //       }
  //       else break;
  //     }
  //     console.log(`${newArmy.name} gets ${newArmy.troops} troops. Edit is ${edit}\n` + ar);
  //     this.maxTroopsSubj.next(max);
  //     this.troopsSubj.next(ar);
  //   });
  // }

  /**
   * Combines the given army$ observable and the editMode subject and subscribes, so whenever editMode or army$ changes, 
   * a new troopstate is computed here and updated via the troopsSubj.
   */
  @Input({ required: true }) 
  set armyMax$(a: Observable<[Army, number]>) {
    if (this.combineSub) {
      this.combineSub.unsubscribe();
    }
    this.combineSub = combineLatest([this.editSubj.asObservable(), a]).subscribe(([edit, [newArmy, max]]) => {
        const ar: [number, boolean][] = [];
      this.allowEdit = edit;
      this.army = newArmy;
      for (let i = 1; i <= newArmy.maxTroops; i++) {
        if (i <= newArmy.troops) {
          ar.push([i, true]);
        }
        else if (edit && (max - i) > 0) {
          ar.push([i, false]);
        }
        else break;
      }
      console.log(`${newArmy.name} gets ${newArmy.troops} troops. Edit is ${edit}\n` + ar);
      this.maxTroopsSubj.next(max);
      this.troopsSubj.next(ar);
    });
  }

  @Input({ required: false })
  set editMode(v: boolean) {
    this.editSubj.next(v);
  }

  @Output() troopsChanged = new EventEmitter<Army>();


  get name(): string {
    return this.army.name;
  }

  get startsOn(): string {
    return this.army.startsOn;
  }

  get troopString(): string {
    return `${this.army.troops} / ${this.army.maxTroops}`;
  }

  get troopStates$(): Observable<[number, boolean][]> {
    return this.troopsSubj.asObservable();
  }


  constructor() {
    const ar: [number, boolean][] = [];
    this.troopsSubj = new BehaviorSubject(ar);
    this.editSubj = new  BehaviorSubject<boolean>(false);
    this.maxTroopsSubj = new Subject<number>();
  }

  /**
   * Only active in editMode and for all icons but the first.
   * Computes the new troopCount according to the following conditions: If the clicked icon represents the last troop, its state gets switched, 
   * otherwise the clicked icon becomes the last icon with the true state.
   * @param troop 
   */
  onClick(troop: [number, boolean]) {
    if (this.allowEdit && troop[0] > 1) {
      let troopCount: number
      if (troop[0] == this.army.maxTroops) {
        troopCount = !troop[1] ? troop[0] : troop[0] - 1;
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
      this.army.troops = troopCount;
      this.troopsChanged.emit(this.army);
  }

  ngOnDestroy() {
    this.combineSub?.unsubscribe();
    this.maxTroopsSub?.unsubscribe();
  }
}
