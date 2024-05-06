import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { RestoreService } from '@app/modules/nation/services/restore.service';

import { SessionService } from '@services/session/session.service';
import { Subscription } from 'rxjs';



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
export class AppStateService implements OnDestroy {

  private _state: AppState;
  private _stateSub: Subscription;

  get state(): AppState {
    return this._state;
  }

  stateChanged: EventEmitter<AppState>;


  constructor(private session: SessionService, private restore: RestoreService) {
    this._state = this.session.getState() ?? AppState.pickNations;

    this.stateChanged = new EventEmitter<AppState>();
    this._stateSub = this.stateChanged.subscribe(next => {
      this.session.saveState(next);
    });
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

  goto(state: AppState) {
    if ([AppState.buyTroops, AppState.battle].includes(state)) {
      this.restore.set();
    }
    this.stateChanged.emit(state);
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
      case (AppState.buyTroops): {
        this.restore.delete();
        this._state = AppState.inGame;
        break;
      }
      case (AppState.battle): {
        this.restore.delete();
        this._state = AppState.inGame;
        break;
      }
    }
    this.stateChanged.emit(this._state);
  }

  ngOnDestroy(): void {
    this._stateSub.unsubscribe();
  }
}
