import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

import { Nation } from '@services/model';
import { GameStateService } from '@services/gameState/gameState.service';
import { NationService } from '@services/nation/nation.service';
import { SessionService } from '@services/session/session.service';

@Component({
  selector: 'app-nation-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
  ],
  templateUrl: './nation-select.component.html',
  styleUrl: './nation-select.component.scss',
})
export class NationSelectComponent {
  
  private all: Map<string, Nation>;
  picked: any;
  
  get nations(): IterableIterator<Nation> {
    return this.all.values();
  }


  constructor(nations: NationService, private session: SessionService, private state: GameStateService) {
    this.all = nations.getAll();
    this.picked = {};
    this.all.forEach(nation => {
      this.picked[nation.name] = false;
    });
  }

  /**
   * Eventhandler for every toggleButton:
   * Updates this.picked according to the pressed button.
   * @param name Name of the pressed button == its representive nation.
   */
  onChange(name: string) {
    this.picked[name] = this.picked[name] ? false : true;
  }

  /**
   * Eventhandler for the form:
   * If 1 or more nations are picked, they are saved to the nationService and the AppState service will 
   * be informed that this stage is completed.
   */
  onSubmit(): void {
    let p: Nation[] = [];
    this.all.forEach(nation => {
      if (this.picked[nation.name] == true) {
        p.push(nation);
      }
    });
    if (p.length >= 1) {
      this.session.pickNations(p);
      this.state.stateCompleted();
    }
  }
}
