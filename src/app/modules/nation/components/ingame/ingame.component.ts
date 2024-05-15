import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppState, AppStateService } from '@services/appState/appState.service';
import { SessionService } from '@services/session/session.service';
import { HideTroopsService } from '../../services/hide-troops.service';



@Component({
  selector: 'app-ingame',
  standalone: false,
  templateUrl: './ingame.component.html',
  styleUrl: './ingame.component.scss'
})
export class IngameComponent implements OnDestroy {

  private hiddenSub: Subscription;
  hidden: boolean = false;


  constructor(session: SessionService, private hide: HideTroopsService, private state: AppStateService) {
    this.hidden = session.getHiddenState();
    this.hiddenSub = this.hide.hidden$.subscribe(value => this.hidden = value);
  }


  buyTroops() {
    this.state.goto(AppState.buyTroops);
  }

  hideArmies() {
    this.hide.changeHidden(true);
  }

  showArmies() {
    this.hide.changeHidden(false);
  }

  startBattle() {
    this.state.goto(AppState.preBattle);
  }

  ngOnDestroy() {
    this.hiddenSub.unsubscribe();
  }
}
