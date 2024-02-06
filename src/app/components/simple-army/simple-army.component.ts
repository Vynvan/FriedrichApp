import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Army, dummy } from '@app/services/model';

@Component({
  selector: 'app-simple-army',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './simple-army.component.html',
  styleUrl: './simple-army.component.scss'
})
export class SimpleArmyComponent implements OnChanges {

  private _army: Army = dummy;
  private _edit?: boolean;
  private _remaining!: number;
  private troopsSubj: Subject<[number, boolean][]>;

  
  @Input({ required: true })
  set army(a: Army) {
    this._army = a;
  }

  @Input({ required: false })
  set editMode(e: boolean) {
    this._edit = e;
  }

  @Input({ required: true, transform: numberAttribute })
  set remaining(r: number) {
    this._remaining = r;
  }


  @Output() troopsChanged;


  get name(): string {
    return this._army.name;
  }

  get startsOn(): string {
    return this._army.startsOn;
  }

  get troopString(): string {
    return `${this._army.troops} / ${this._army.maxTroops}`;
  }

  get troopStates$(): Observable<[number, boolean][]> {
    return this.troopsSubj.asObservable();
  }


  constructor(private route: ActivatedRoute) {
    this.troopsChanged = new EventEmitter<Army>();
    this.troopsSubj = new ReplaySubject<[number, boolean][]>(1);
  }


  ngOnChanges(changes: SimpleChanges): void {
    const relevantChange = changes['army'] || changes['editMode'] || changes['remaining'];
    const validInputs = this._army.name != 'dummy' && this._edit != undefined && this._remaining != undefined;
    if (relevantChange && validInputs) {
      console.log(`${this._army.name}: OnChanges runs setTroops`);
      this.setTroops();
    }
  }

  /**
   * Only active in editMode and for all icons but the first.
   * Computes the new troopCount according to the following conditions: If the clicked icon represents the last troop, its state gets switched, 
   * otherwise the clicked icon becomes the last icon with the true state.
   * @param troop 
   */
  onClick(troop: [number, boolean]) {
    if (this._edit && (troop[0] > 1 || troop[1])) {
      let troopCount: number;
      let max = this.getMaxTroops();
      if (troop[0] == max) {
        troopCount = troop[1] ? troop[0]-1 : troop[0];
      }
      else {
        troopCount = troop[0];
      }
      this.submitChange(troopCount);
    }
  }

  private getMaxTroops(): number {
    return this._army.troops + this._remaining < this._army.maxTroops ? this._army.troops + this._remaining : this._army.maxTroops;
  }
  
  /**
   * Subscribes to the army observable, so whenever army$ changes, a new troopstate is computed here and updated via the troopsSubj.
   */
  private setTroops() {
    const ar: [number, boolean][] = [];
    for (let i = 1; i <= this._army.maxTroops; i++) {
      if (i <= this._army.troops) {
        ar.push([i, true]);
      }
      else if (this._edit && (this.getMaxTroops() - i) >= 0) {
        ar.push([i, false]);
      }
      else break;
    }
    console.log(`setTroops: ${this._army.name} gets ${this._army.troops} troops... edit is ${this._edit}, remaining is ${this._remaining}`);
    this.troopsSubj.next(ar);
  }
  
  /**
   * Subscribes to the army$ observable, edits the given army and emits if via the troopsChanged event. Unsubcribes after that.
   * @param troopCount 
   */
  private submitChange(troopCount: number) {
      this._army.troops = troopCount;
      this.troopsChanged.emit(this._army);
  }
}