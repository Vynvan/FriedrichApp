import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { AppSessionService } from '@services/appSession/appSession.service';
import { AppStateService, AppState } from '@services/appState/appState.service';
import { NationService } from '@services/nation/nation.service';


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


  constructor(private appState: AppStateService, private nations: NationService, private router: Router, private session: AppSessionService) {
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
    switch(state) {
      case(AppState.pickNations): {
        this.router.navigate(['NationSelect']);
        break;
      }
      case(AppState.distributeTroops): {
        let active = this.session.getActive();
        this.router.navigate(['DistributeTroops', active ?? this.nations.picked[0].name]);
        break;
      }
    }
  }
}
