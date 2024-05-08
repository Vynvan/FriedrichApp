import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, numberAttribute } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';

import { Army, dummy } from '@app/services/model';
import { HideTroopsService } from '../../services/hide-troops.service';
import { AppState, AppStateService } from '@app/services/appState/appState.service';



@Component({
  selector: 'app-army',
  standalone: false,
  templateUrl: './army.component.html',
  styleUrl: './army.component.scss'
})
export class ArmyComponent implements OnChanges {

  private appearanceClass = '';
  private edit = false;
  private editSub?: Subscription;
  private troopsSubj = new ReplaySubject<[number, boolean][]>(1);
  troopVisibility = 'hidden';


  get appearance(): string {
    return this.appearanceClass;
  }

  @Input({ required: true })
  army: Army = dummy;

  @Input({ required: true, transform: numberAttribute })
  private remaining!: number;

  @Input({ required: true })
  set editMode(o: Observable<boolean>) {
    this.editSub?.unsubscribe();
    this.editSub = o.subscribe(edit => {
      if (this.edit != edit) {
        this.edit = edit;
        this.setTroops();
      }
    });
  }

  @Output() troopsChanged = new EventEmitter<Army>();


  get troopStates$(): Observable<[number, boolean][]> {
    return this.troopsSubj as Observable<[number, boolean][]>;
  }

  
  constructor(hide: HideTroopsService, private state: AppStateService) {
    hide.hidden$.subscribe(value => this.troopVisibility = value ? 'hidden' : 'visible');
  }


  ngOnChanges(changes: SimpleChanges): void {
    const relevantChange = changes['army'] || changes['remaining'];
    const validInputs = this.army.name != 'dummy' && this.remaining != undefined;
    if (relevantChange && validInputs)
      this.setTroops();
  }

  ngOnDestroy(): void {
    this.editSub?.unsubscribe();
  }

  /**
   * Only active in editMode and for all icons but the first.
   * Computes the new troopCount according to the following conditions: If the clicked icon represents the last troop, its state gets switched, 
   * otherwise the clicked icon becomes the last icon with the true state.
   * @param troop 
   */
  onClick([troopIndex, isEnabled]: [number, boolean]) {
    if (this.edit && (troopIndex > 1 || isEnabled)) {
      let troopCount: number;
      const last = troopIndex > 1 && isEnabled && troopIndex == this.army.troops; // If not the first troop and last enabled
      const max = this.getMaxTroops();
      if (troopIndex == max || last) // If last selectable
        troopCount = isEnabled ? troopIndex-1 : troopIndex;
      else troopCount = troopIndex;
      this.submitChange(troopCount);
    }
  }

  private getMaxTroops(): number {
    return this.army.troops + this.remaining < this.army.maxTroops ? this.army.troops + this.remaining : this.army.maxTroops;
  }
  
  private setAppearance() {
    if ([AppState.preBattle].includes(this.state.state)) {
      this.appearanceClass = 'preBattle';
    }
  }

  /**
   * Subscribes to the army observable, so whenever army$ changes, a new troopstate is computed here and updated via the troopsSubj.
   */
  private setTroops() {
    const ar: [number, boolean][] = [];
    for (let i = 1; i <= this.army.maxTroops; i++) {
      if (i <= this.army.troops)
        ar.push([i, true]);
      else if (this.edit && (this.getMaxTroops() - i) >= 0)
        ar.push([i, false]);
      else break;
    }
    this.troopsSubj.next(ar);
  }
  
  /**
   * Subscribes to the army$ observable, edits the given army and emits if via the troopsChanged event. Unsubcribes after that.
   * @param troopCount 
   */
  private submitChange(troopCount: number) {
    this.army.troops = troopCount;
    this.troopsChanged.emit(this.army);
  }
}