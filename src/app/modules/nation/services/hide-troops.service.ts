import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { SessionService } from '@app/services/session/session.service';
import { AppState, AppStateService } from '@app/services/appState/appState.service';



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

  constructor(private session: SessionService, state: AppStateService) {
    this.before = this.session.getHiddenState();
    this.hiddenSubj = new BehaviorSubject(this.before);
    this.stateSub = state.stateChanged.subscribe(next => {
      if ([AppState.battle, AppState.buyTroops].includes(next)) {
        this.before = this.hiddenSubj.getValue();
        this.changeHidden(false);
      }
      else if (next == AppState.inGame) {
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
      console.log('hidden changes to ' + value);
    }
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }
}
