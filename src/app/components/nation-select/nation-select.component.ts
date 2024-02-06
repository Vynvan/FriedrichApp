import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

import { NationService } from '@app/services/nation.service';
import { Nation } from '@app/services/model';
import { AppStateService } from '@app/services/appState/appState.service';

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
  
  picked: any;
  
  get nations(): IterableIterator<Nation> {
    return this.nationService.all.values();
  }


  constructor(private nationService: NationService, private appState: AppStateService) {
    this.picked = {};
    this.nationService.all.forEach(nation => {
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
    let i = 0;
    let p: Nation[] = [];
    this.nationService.all.forEach(nation => {
      if (this.picked[nation.name] == true) {
        i++;
        p.push(nation);
      }
    });
    if (i >= 1) {
      this.nationService.picked = p;
      this.appState.stateCompleted();
    }
  }
}
