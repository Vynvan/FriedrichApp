import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { GameState, GameStateService } from '@services/gameState/gameState.service';
import { SessionService } from '@services/session/session.service';
import { HideTroopsService } from '@nation/services/hide-troops/hide-troops.service';



@Component({
  selector: 'app-ingame',
  standalone: false,
  templateUrl: './ingame.component.html',
  styleUrl: './ingame.component.scss'
})
export class IngameComponent implements OnDestroy {

  private hiddenSub: Subscription;
  hidden: boolean = false;


  constructor(session: SessionService, private hide: HideTroopsService, private state: GameStateService) {
    this.hidden = session.getHiddenState();
    this.hiddenSub = this.hide.hidden$.subscribe(value => this.hidden = value);
  }


  buyTroops() {
    this.state.goto(GameState.buyTroops);
  }

  hideArmies() {
    this.hide.changeHidden(true);
  }

  showArmies() {
    this.hide.changeHidden(false);
  }

  startBattle() {
    this.state.goto(GameState.preBattle);
  }

  ngOnDestroy() {
    this.hiddenSub.unsubscribe();
  }
}
