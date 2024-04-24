import { Injectable, EventEmitter } from '@angular/core';

import { SessionService } from '@app/services/session/session.service';



export enum AppState {
  pickNations,
  distributeTroops,
  inGame,
  fight,
  buyTroops,
  afterGame
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

  private _state: AppState;
  get state(): AppState {
    return this._state;
  }
  private set state(st: AppState) {
    this._state = st;
  }

  stateChanged = new EventEmitter<AppState>();


  constructor(private session: SessionService) {
    this._state = this.session.getState() ?? AppState.pickNations;
    this.stateChanged.subscribe(next => this.session.saveState(next));
  }


  /**
   * Resets the app to start all over.
   */
  cancel() {
    if (this.state == AppState.distributeTroops) {
      this.session.delete();
      this._state = AppState.pickNations;
      this.stateChanged.emit(AppState.pickNations);
    }
  }

  /**
   * If a state completes, the state of the services is checked to decide what stage comes next.
   */
  stateCompleted() {
    switch(this._state) {
      case (AppState.pickNations): {
        // If every army of every picked nation is at maxTroops (like sweden or imperialArmy), the distributeTroops phase is skipped.
        let next = this.session.pickedNations.every(nation => nation.armies.every(army => army.troops == nation.maxTroops))
        ? AppState.inGame : AppState.distributeTroops;
        this._state = next;
        this.session.saveNations(this.session.pickedNations);
        break;
      }
      case(AppState.distributeTroops): {
        this._state = AppState.inGame;
        break;
      }
    }
    this.stateChanged.emit(this._state);
  }
}
