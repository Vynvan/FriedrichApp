import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { BattleService } from '@services/battle/battle.service';
import { RestoreService } from '@services/restore/restore.service';
import { SessionService } from '@services/session/session.service';



export enum GameState {
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
export class GameStateService implements OnDestroy {

  private _state: GameState;
  private stateSub: Subscription;
  private stateSubj: BehaviorSubject<GameState>;
  
  get state(): GameState {
    return this._state;
  }
  private set state(value: GameState) {
    this._state = value;
    this.stateSubj.next(value);
  }

  get state$(): Observable<GameState> {
    return this.stateSubj as Observable<GameState>;
  }



  constructor(private battle: BattleService, private session: SessionService, private restore: RestoreService) {
    this._state = this.session.getState() ?? GameState.pickNations;
    this.stateSubj = new BehaviorSubject<GameState>(this._state);
    this.stateSub = this.stateSubj.subscribe(s => this.session.saveState(s));
  }


  /**
   * Resets the current state and goes back to a default state OR when in normal state ends the app to start all over.
   */
  cancel() {
    switch (this._state) {
      case GameState.buyTroops: {
        this.restore.restore();
        this.state = GameState.inGame;
        break;
      }
      case GameState.preBattle: {
        this.battle.reset();
        this.state = GameState.inGame;
        break;
      }
      default: {
        this.restore.delete();
        this.session.delete();
        this.state = GameState.pickNations;  
      }
    }
  }

  goto(state: GameState) {
    switch (state) {
      case GameState.buyTroops: {
        this.restore.set();
        break;
      }
      case GameState.preBattle: {
        this.battle.reset();
        this.battle.nation = this.session.activeNation;
        break;
      }
      default: {}
      }
    this.state = state;
  }

  /**
   * If a state completes, the state of the services is checked to decide what stage comes next.
   */
  stateCompleted() {
    switch(this._state) {
      case (GameState.pickNations): {
        // If every army of every picked nation is at maxTroops (like sweden or imperialArmy), the distributeTroops phase is skipped.
        const next = this.session.pickedNations.every(nation => nation.armies.every(army => army.troops == nation.maxTroops))
        ? GameState.inGame : GameState.distributeTroops;
        this.session.saveNations(this.session.pickedNations, true);
        this.state = next;
        break;
      }
      case GameState.buyTroops: {
        this.restore.delete();
        this.state = GameState.inGame;
        break;
      }
      case GameState.preBattle: {
        this.state = GameState.battle;
        break;
      }
      default: {}
    }
  }

  ngOnDestroy(): void {
    this.stateSub.unsubscribe();
  }
}