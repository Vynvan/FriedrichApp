import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, EMPTY, Observable, Subscription, combineLatest, map } from 'rxjs';

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
  private armySub?: Subscription;
  private editSubj: BehaviorSubject<boolean>;
  private troopsSubj: BehaviorSubject<[number, boolean][]>;


  /**
   * Combines the given army$ and the editMode subject and subscribes, so whenever editMode or army$ changes, 
   * a new troopstate is computed and updated via the troopsSubj.
   */
  @Input({ required: true }) 
  set army$(a: Observable<Army>) {
    if (this.armySub) {
      this.armySub.unsubscribe();
    }
    this.armySub = combineLatest([this.editSubj.asObservable(), a]).subscribe(([edit, newArmy]) => {
      const ar: [number, boolean][] = [];
      this.allowEdit = edit;
      this.army = newArmy;
      for (let i = 0; i < newArmy.troops; i++) {
        ar.push([i + 1, true]);
      }
      if (edit) {
          for (let i = newArmy.troops; i < newArmy.maxTroops; i++) {
            ar.push([i + 1, false]);
          }
      }
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

  get troops(): number {
    return this.army.troops;
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
    return this.troopsSubj.asObservable();
  }


  constructor() {
    const ar: [number, boolean][] = [];
    this.troopsSubj = new BehaviorSubject(ar);
    this.editSubj = new  BehaviorSubject<boolean>(false);
  }

  ngOnInit(): void {
    
  }

  /**
   * Only active in editMode.
   * Changes the clicked troopState icon AND changes the other troopStates accordingly. If the clicked troop was active, it turns into the first inactive. 
   * If it was inactive it becomes the last active. After that, 'submitChange' emits the troopsChanged event.
   * @param troop 
   */
  onClick(troop: [number, boolean]) {
    if (this.allowEdit) {
      let troopCount = 0;
      const prev = this.troopsSubj.getValue();
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
      this.army.troops = troopCount;
      this.troopsChanged.emit(this.army);
  }

  ngOnDestroy() {
    this.armySub?.unsubscribe();
  }
}
