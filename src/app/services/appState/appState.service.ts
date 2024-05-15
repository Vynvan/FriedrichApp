import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { RestoreService } from '@app/modules/nation/services/restore.service';

import { SessionService } from '@services/session/session.service';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';



export enum AppState {
  pickNations,
  distributeTroops,
  inGame,
  preBattle,
  battle,
  buyTroops
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
  private stateSub: Subscription;
  private stateSubj: BehaviorSubject<AppState>;
  
  get state(): AppState {
    return this._state;
  }
  private set state(value: AppState) {
    this._state = value;
    this.stateSubj.next(value);
  }

  get state$(): Observable<AppState> {
    return this.stateSubj as Observable<AppState>;
  }



  constructor(private session: SessionService, private restore: RestoreService) {
    this._state = this.session.getState() ?? AppState.pickNations;
    this.stateSubj = new BehaviorSubject<AppState>(this._state);
    this.stateSub = this.stateSubj.subscribe(s => this.session.saveState(s));
  }


  /**
   * Resets the app to start all over.
   */
  cancel() {
    this.session.delete();
    this.state = AppState.pickNations;
  }

  goto(state: AppState) {
    if ([AppState.buyTroops, AppState.battle].includes(state)) {
      this.restore.set();
    }
    this.state = state;
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
        this.session.saveNations(this.session.pickedNations, true);
        this.state = next;
        break;
      }
      default: {
        this.restore.delete();
        this.state = AppState.inGame;
      }
    }
  }

  ngOnDestroy(): void {
    this.stateSub.unsubscribe();
  }
}