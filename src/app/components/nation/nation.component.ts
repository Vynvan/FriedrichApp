import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, map, Observable, Subscription } from 'rxjs';

import { ArmyComponent } from "@components/army/army.component";
import { NavComponent } from '@components/nav/nav.component';
import { Army, Nation$ } from '@services/model';
import { NationService } from '@services/nation/nation.service';



/**
 * This main component has a header showing the nations name and a total troop count. Under this all armies are listed with options. 
 * This is directly represented in the total troop count above.
 * Child components are army and nav.
 */
@Component({
    selector: 'app-distribute',
    standalone: true,
    templateUrl: './nation.component.html',
    styleUrl: './nation.component.scss',
    imports: [
      ArmyComponent,
      CommonModule,
      NavComponent
    ]
})
export class NationComponent {

  protected _nation!: Nation$;
  private paramSub?: Subscription;

  @Input()
  set nationName(name: string) {
    this._nation = this.nations.picked.find(nation => nation.name === name) ?? this.nations.picked[0];
  }
  get nationName(): string {
    return this._nation.name;
  }
  
  get armies$(): Observable<Army[]> {
    return combineLatest(this._nation.armies$);
  }

  get maxTroops(): number {
    return this._nation.maxTroops;
  }

  get remainingTroops$(): Observable<number> {
    return combineLatest(this._nation.armies$).pipe(
      map(armies => armies.map(a => a.troops)),
      map(armies => armies.reduce((prev, curr) => prev + curr)),
      map(troops => this._nation.maxTroops - troops)
    );
  }

  get troops$(): Observable<number> {
    return this._nation.troops$;
  }


  constructor(protected nations: NationService) {  }


  /**
   * Calls the 'updateArmy' function of the nation object.
   * @param updated 
   */
  updateArmy(updated: Army) {
    this._nation.updateArmy(updated);
  }

  ngOnDestroy() {
    this.paramSub?.unsubscribe();
  }
}
