import { Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, Subscription } from 'rxjs';

import { Army, Nation$ } from '@services/model';
import { SessionService } from '@services/session/session.service';
import { AppState, AppStateService } from '@services/appState/appState.service';



/**
 * This main component has a header showing the nations name and a total troop count. Under this all armies are listed with options. 
 * This is directly represented in the total troop count above.
 * Child components are army and nav.
 */
@Component({
    selector: 'app-distribute',
    standalone: false,
    templateUrl: './nation.component.html',
    styleUrl: './nation.component.scss',
})
export class NationComponent {

  private _editMode = new BehaviorSubject<boolean>(false);
  private editSub?: Subscription;
  private nation!: Nation$;


  @Input()
  set nationName(name: string) {
    this.nation = this.session.pickedNations.find(nation => nation.name === name) ?? this.session.pickedNations[0];
  }
  get nationName(): string {
    return this.nation.name;
  }
  
  
  get armies$(): Observable<Army[]> {
    return combineLatest(this.nation.armies$);
  }

  get editMode$(): Observable<boolean> {
    return this._editMode.asObservable();
  }

  get maxTroops(): number {
    return this.nation.maxTroops;
  }

  get remainingTroops$(): Observable<number> {
    return combineLatest(this.nation.armies$).pipe(
      map(armies => armies.map(a => a.troops)),
      map(armies => armies.reduce((prev, curr) => prev + curr)),
      map(troops => this.nation.maxTroops - troops)
    );
  }

  get troops$(): Observable<number> {
    return this.nation.troops$;
  }


  constructor(private session: SessionService, state: AppStateService) {
    let initialState = this.session.getState();
    this._editMode.next(initialState == AppState.distributeTroops);
    this.editSub = state.stateChanged.subscribe(changed => {
      let edit = changed == AppState.distributeTroops;
      console.log(this.nation.name + '/Distribute: EditMode=' + edit);
      this._editMode.next(edit);
    });
  }


  /**
   * Calls the 'updateArmy' function of the nation object.
   * @param updated 
   */
  updateArmy(updated: Army) {
    this.nation.updateArmy(updated);
  }

  ngOnDestroy() {
    this.editSub?.unsubscribe();
  }
}
