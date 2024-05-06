import { Component } from '@angular/core';

import { AppStateService } from '@app/services/appState/appState.service';
import { RestoreService } from '../../services/restore.service';



@Component({
  selector: 'app-redistribute',
  templateUrl: './redistribute.component.html',
  styleUrl: './redistribute.component.scss'
})
export class RedistributeComponent {

  constructor(private restore: RestoreService, private state: AppStateService) { }


  onCancel() {
    this.restore.restore();
    this.state.stateCompleted();
  }

  onSubmit() {
    this.state.stateCompleted();
  }
}
