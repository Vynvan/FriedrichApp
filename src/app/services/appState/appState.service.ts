import { Injectable, EventEmitter } from '@angular/core';

import { NationService } from '@services/nation/nation.service';
import { AppSessionService } from '@services/appSession/appSession.service';


export enum AppState {
  pickNations,
  distributeTroops,
  inGame,
  fight,
  buyTroops,
  afterGame,
  unknown
}



/**
 * The appState service handles the state of the app. The different states are differentiated with the AppState enumerable.
 * Whenever the player progresses through a state, the corresponding component calls the stateCompleted method, this service set the new state 
 * and emits the stateChanged event.
 */
@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private _state: AppState = AppState.unknown;
  get state(): AppState {
    if (this._state == AppState.unknown) {
      this._state = this.session.getState();
    }
    return this._state;
  }
  private set state(st: AppState) {
    this._state = st;
  }

  public stateChanged = new EventEmitter<AppState>()


  constructor(private nations: NationService, private session: AppSessionService) {
    this.stateChanged.subscribe(next => this.session.saveState(next));
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
        this.session.saveNations(this.nations.picked);
        this.stateChanged.emit(next);
        break;
      }
      case(AppState.distributeTroops): {

      }
    }
  }
}
