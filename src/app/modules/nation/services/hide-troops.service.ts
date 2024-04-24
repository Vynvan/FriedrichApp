import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SessionService } from '@app/services/session/session.service';



@Injectable({
  providedIn: 'root'
})
export class HideTroopsService {

  private _hidden$: BehaviorSubject<boolean>;
  get hidden$(): Observable<boolean> {
    return this._hidden$.asObservable();
  }

  constructor(private session: SessionService) {
    this._hidden$ = new BehaviorSubject(this.session.getHiddenState());
  }


  /**
 * Changes the state of the hidden observable and saves it  to session.
 * @param value 
 */
  changeHidden(value: boolean) {
    console.log(`State: hiddenState: ${this._hidden$.getValue()} to ${value}`)
    if (this._hidden$.getValue() != value) {
      this.session.saveHiddenState(value);
      this._hidden$.next(value);
    }
  }  
}
