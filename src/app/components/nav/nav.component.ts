import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AppState, AppStateService } from '@services/appState/appState.service';
import { SessionService } from '@services/session/session.service';



@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink
],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

  private _activeNation!: string;


  @Input({ required: true })
  set activeNation(a: string) {
    this._activeNation = a;
    this.session.saveActive(a);
  }
  get activeNation(): string {
    return this._activeNation;
  }
  
  get nationNames(): string[] {
    return this.session.pickedNations.map(nat => nat.name);
  }

  get parent(): string {
    switch(this.state.state) {
      case AppState.distributeTroops:
        return "DistributeTroops";
      default:
        return "";
    }
  }


  constructor(private session: SessionService, private state: AppStateService) {}


  navigateTo(nationName: string): string {
    return `/${ this.parent }/${ nationName }`;
  }
}
