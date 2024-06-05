import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { GameStateService, GameState } from '@services/gameState/gameState.service';
import { SessionService } from '@services/session/session.service';


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


  constructor(private state: GameStateService, private router: Router, private session: SessionService) {
    this.state.state$.subscribe(next => this.computeState(next));
  }


  /**
   * Eventhandler for AppState.stateChanged:
   * Navigates to the sub-components according to the given state.
   */
  private computeState(state: GameState) {
    switch(state) {
      case(GameState.pickNations): {
        this.router.navigate(['NationSelect']);
        break;
      }
      case(GameState.distributeTroops): {
        this.router.navigate([this.session.activeNation.name, 'Distribute']);
        break;
      }
      case(GameState.inGame): {
        this.router.navigate([this.session.activeNation.name]);
        break;
      }
      case(GameState.buyTroops): {
        this.router.navigate([this.session.activeNation.name, 'BuyTroops']);
        break;
      }
    }
  }
}
