import { Component } from '@angular/core';

import { SessionService } from '@app/services/session/session.service';
import { HideTroopsService } from '../../services/hide-troops.service';



@Component({
  selector: 'app-ingame',
  standalone: false,
  templateUrl: './ingame.component.html',
  styleUrl: './ingame.component.scss'
})
export class IngameComponent {

  hidden: boolean = false;


  constructor(session: SessionService, private hide: HideTroopsService) {
    this.hidden = session.getHiddenState();
    this.hide.hidden$.subscribe(value => this.hidden = value);
  }


  buyTroops() {
    
  }

  hideArmies() {
    this.hide.changeHidden(true);
  }

  showArmies() {
    this.hide.changeHidden(false);
  }

  startBattle() {

  }
}
