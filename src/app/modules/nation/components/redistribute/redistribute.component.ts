import { Component, OnDestroy } from '@angular/core';
import { AppState, AppStateService } from '@app/services/appState/appState.service';
import { RestoreService } from '../../services/restore.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-redistribute',
  templateUrl: './redistribute.component.html',
  styleUrl: './redistribute.component.scss'
})
export class RedistributeComponent implements OnDestroy {

  private _stateSub?: Subscription;


  constructor(private restore: RestoreService, private state: AppStateService) {
    this._stateSub = this.state.stateChanged.subscribe(state => {
      if (state == AppState.battle || state == AppState.buyTroops) {
        this.restore.set();
      }
      else this.restore.delete();
    });
  }


  onCancel() {
    this.restore.restore();
    this.state.stateCompleted();
  }

  onSubmit() {
    this.state.stateCompleted();
  }

  ngOnDestroy() {
    this._stateSub?.unsubscribe();
  }
}
