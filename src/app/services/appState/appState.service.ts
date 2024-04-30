import { Injectable, EventEmitter } from '@angular/core';

import { SessionService } from '@services/session/session.service';



export enum AppState {
  pickNations,
  distributeTroops,
  inGame,
  battle,
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

  stateChanged = new EventEmitter<AppState>();


  constructor(private session: SessionService) {
    this._state = this.session.getState() ?? AppState.pickNations;
    this.stateChanged.subscribe(next => this.session.saveState(next));
  }


  /**
   * Resets the app to start all over.
   */
  cancel() {
    if (this._state == AppState.distributeTroops) {
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
        const next = this.session.pickedNations.every(nation => nation.armies.every(army => army.troops == nation.maxTroops))
        ? AppState.inGame : AppState.distributeTroops;
        this._state = next;
        this.session.saveNations(this.session.pickedNations);
        break;
      }
      default: {
        this._state = AppState.inGame;
      }
    }
    this.stateChanged.emit(this._state);
  }
}
