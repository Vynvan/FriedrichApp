import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { SessionService } from '@app/services/session/session.service';
import { AppState, AppStateService } from '@app/services/appState/appState.service';



@Injectable({
  providedIn: 'root'
})
export class HideTroopsService {

  private _before: boolean;
  private stateSub: Subscription;
  private _hidden$: BehaviorSubject<boolean>;
  get hidden$(): Observable<boolean> {
    return this._hidden$.asObservable();
  }

  constructor(private session: SessionService, state: AppStateService) {
    this._before = this.session.getHiddenState();
    this._hidden$ = new BehaviorSubject(this._before);
    this.stateSub = state.stateChanged.subscribe(next => {
      if ([AppState.battle, AppState.buyTroops].includes(next)) {
        this._before = this._hidden$.getValue();
        this.changeHidden(false);
      }
      else if (next == AppState.inGame) {
        this.changeHidden(this._before);
      }
    });
  }


  /**
 * Changes the state of the hidden observable and saves it  to session.
 * @param value 
 */
  changeHidden(value: boolean) {
    if (this._hidden$.getValue() != value) {
      this.session.saveHiddenState(value);
      this._hidden$.next(value);
    }
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }
}
