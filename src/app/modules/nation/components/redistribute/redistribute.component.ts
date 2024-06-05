import { Component } from '@angular/core';

import { GameStateService } from '@services/gameState/gameState.service';
import { RestoreService } from '@services/restore/restore.service';



@Component({
  selector: 'app-redistribute',
  templateUrl: './redistribute.component.html',
  styleUrl: './redistribute.component.scss'
})
export class RedistributeComponent {

  constructor(private restore: RestoreService, private state: GameStateService) { }


  onCancel() {
    this.restore.restore();
    this.state.stateCompleted();
  }

  onSubmit() {
    this.state.stateCompleted();
  }
}
