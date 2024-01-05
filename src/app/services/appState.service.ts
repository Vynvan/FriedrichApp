import { Injectable, EventEmitter } from '@angular/core';
import { NationService } from './nation.service';


export enum AppState {
  pickNations,
  distributeTroops,
  inGame,
  fight,
  buyTroops,
  afterGame
}


@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private _state: AppState;
  get state(): AppState {
    return this._state;
  }
  private set state(st: AppState) {
    this._state = st;
  }

  public stateChanged = new EventEmitter<AppState>()

  constructor(private nations: NationService) {
    this._state = AppState.pickNations;
  }


  /**
   * If a state completes, the state of the services is checked to decide what stage comes next.
   */
  stateCompleted() {
    switch(this._state) {
      case (AppState.pickNations): {
        // If every army of every picked nation is at maxTroops (like sweden or imperialArmy), the distributeTroops phase is skipped.
        let next = this.nations.picked.every(nation => nation.armies.every(army => army.troops == nation.maxTroops)) 
        ? AppState.inGame : AppState.distributeTroops;
        // console.log("State completed: pickNations");
        this.state = next;
        this.stateChanged.emit(next);
        break;
      }
      case(AppState.distributeTroops): {

      }
    }
  }
}
