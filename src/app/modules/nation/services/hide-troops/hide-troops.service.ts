import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { GameState, GameStateService } from '@services/gameState/gameState.service';
import { SessionService } from '@services/session/session.service';



@Injectable({
  providedIn: 'root'
})
export class HideTroopsService {

  private before: boolean;
  private stateSub: Subscription;
  private hiddenSubj: BehaviorSubject<boolean>;
  get hidden$(): Observable<boolean> {
    return this.hiddenSubj as Observable<boolean>;
  }

  constructor(private session: SessionService, state: GameStateService) {
    this.before = this.session.getHiddenState();
    this.hiddenSubj = new BehaviorSubject(this.before);
    this.stateSub = state.state$.subscribe(next => {
      if ([GameState.battle, GameState.buyTroops].includes(next)) {
        this.before = this.hiddenSubj.getValue();
        this.changeHidden(false);
      }
      else if (next == GameState.inGame) {
        this.changeHidden(this.before);
      }
    });
  }


  /**
 * Changes the state of the hidden observable and saves it  to session.
 * @param value 
 */
  changeHidden(value: boolean) {
    if (this.hiddenSubj.getValue() != value) {
      this.session.saveHiddenState(value);
      this.hiddenSubj.next(value);
    }
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }
}
