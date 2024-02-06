import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { NationService } from './services/nation/nation.service';
import { AppStateService, AppState } from './services/appState/appState.service';


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

  constructor(private nations: NationService, private appState: AppStateService, private router: Router) {
    this.appState.stateChanged.subscribe(next => this.computeState(next));
    this.computeState();
  }

  /**
   * Eventhandler for AppState.stateChanged:
   * Navigates to the sub-components according to the given state.
   */
  private computeState(state?: AppState) {
    state = state ?? this.appState.state;
    // console.log("compute state ", state?.toString());
    switch(state) {
      case(AppState.pickNations): {
        this.router.navigate(['NationSelect']);
        break;
      }
      case(AppState.distributeTroops): {
        this.router.navigate(['DistributeTroops', this.nations.picked[0].name]);
        break;
      }
    }

  }
}
