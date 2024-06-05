import { Component, Input } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Army, Nation$ } from '@services/model';
import { SessionService } from '@services/session/session.service';



/**
 * This main component has a header showing the nations name and a total troop count. Under this all armies are listed with options. 
 * This is directly represented in the total troop count above.
 * Child components are army and nav.
 */
@Component({
    selector: 'app-distribute',
    standalone: false,
    templateUrl: './nation.component.html',
    styleUrl: './nation.component.scss',
})
export class NationComponent {

  private nation!: Nation$;


  @Input()
  set nationName(name: string) {
    this.session.saveActive(name);
    this.nation = this.session.activeNation;
  }
  get nationName(): string {
    return this.nation.name;
  }
  
  
  get armies$(): Observable<Army[]> {
    return this.nation.armies$;
  }

  get maxTroops(): number {
    return this.nation.maxTroops;
  }

  get remainingTroops$(): Observable<number> {
    return this.nation.troops$.pipe(map(troops => this.nation.maxTroops - troops));
  }

  get troops$(): Observable<number> {
    return this.nation.troops$;
  }


  constructor(private session: SessionService) { }


  /**
   * Calls the 'updateArmy' function of the nation object.
   * @param updated 
   */
  updateArmy(updated: Army) {
    this.nation.updateArmy(updated);
  }
}
