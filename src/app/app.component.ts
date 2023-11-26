import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NationService } from './services/nation.service';
import { AppStateService, AppState } from './services/appState.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FriedrichApp';

  constructor(private nations: NationService, private appState: AppStateService, private router: Router) {
    this.appState.stateChanged.subscribe(this.computeState);
    this.computeState();
  }


  private computeState(state?: AppState) {
    console.log("compute state ", state?.toString());
    state = state ?? this.appState.state;
    switch(state) {
      case(AppState.pickNations): {
        this.router.navigate(['NationSelect']);
        break;
      }
      case(AppState.distributeTroops): {
        this.router.navigate(['DistributeTroops']);
        break;
      }
    }

  }
}
