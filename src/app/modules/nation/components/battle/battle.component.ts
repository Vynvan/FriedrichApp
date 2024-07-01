import { Component, Input } from '@angular/core';

import { Army, Nation } from '@services/model';
import { SessionService } from '@services/session/session.service';
import { EnemyService } from '@nation/services/enemy/enemy.service';



@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrl: './battle.component.scss'
})
export class BattleComponent {

  private nation!: Nation;
  party: Army[] = [];


  @Input()
  set nationName(name: string) {
    this.nation = this.session.pickedNations.find(nation => nation.name === name) ?? this.session.pickedNations[0];
  }
  get nationName(): string {
    return this.nation.name;
  }

  get enemyParty(): Army[] {
    return this.enemy.party;
  }

  get ready(): boolean {
    return false;
  }


  constructor(private enemy: EnemyService, private session: SessionService) {
    
  }


  lost() {

    this.enemy.reset();
  }

  won() {

    this.enemy.reset();
  }
}
