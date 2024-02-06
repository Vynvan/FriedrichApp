import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AppState, AppStateService } from '@app/services/appState/appState.service';
import { NationService } from '@app/services/nation/nation.service';

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

  get nationNames(): string[] {
    return this.nations.picked.map(nat => nat.name);
  }

  get parent(): string {
    switch(this.state.state) {
      case AppState.distributeTroops:
        return "DistributeTroops";
      default:
        return "";
    }
  }

  @Input({ required: true }) activeNation!: string;
  

  constructor(private nations: NationService, private state: AppStateService) {}

}
