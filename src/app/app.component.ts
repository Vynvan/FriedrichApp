import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { SessionService } from '@app/services/session/session.service';
import { AppStateService, AppState } from '@services/appState/appState.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'FriedrichApp';


  constructor(private appState: AppStateService, private router: Router, private session: SessionService) {
    this.appState.stateChanged.subscribe(next => this.computeState(next));
    this.computeState();
  }


  /**
   * Eventhandler for AppState.stateChanged:
   * Navigates to the sub-components according to the given state.
   */
  private computeState(state?: AppState) {
    if (!state)
      state = this.appState.state;
    
    let active = this.session.getActive();
    switch(state) {
      case(AppState.pickNations): {
        this.router.navigate(['NationSelect']);
        break;
      }
      case(AppState.distributeTroops): {
        this.router.navigate([active ?? this.session.pickedNations[0].name, 'Distribute']);
        break;
      }
      case(AppState.inGame): {
        this.router.navigate([active ?? this.session.pickedNations[0].name]);
        break;
      }
    }
  }
}
