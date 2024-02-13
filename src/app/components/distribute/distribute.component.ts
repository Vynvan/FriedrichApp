import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, distinctUntilChanged, map, Observable, Subscription } from 'rxjs';

import { ArmyComponent } from '@components/army/army.component';
import { NavComponent } from '@components/nav/nav.component';
import { SimpleArmyComponent } from "@components/simple-army/simple-army.component";
import { Army, Nation$ } from '@services/model';
import { NationService } from '@services/nation/nation.service';


/**
 * This main component has a header showing the nations name and a total troop count. Under this all armies are listed with the posibility 
 * to add and withdraw troops. This is directly represented in the total troop count above.
 * Child components are army and nav.
 */
@Component({
    selector: 'app-distribute',
    standalone: true,
    templateUrl: './distribute.component.html',
    styleUrl: './distribute.component.scss',
    imports: [
        CommonModule,
        ArmyComponent,
        NavComponent,
        SimpleArmyComponent
    ]
})
export class DistributeComponent {

  private _nation!: Nation$;
  private paramSub?: Subscription;

  @Input()
  set nationName(name: string) {
    this._nation = this.nations.picked.find(nation => nation.name === name) ?? this.nations.picked[0];
  }
  get nationName(): string {
    return this._nation.name;
  }
  
  /**
   * DEPRICATED! Returns an combineLatest of each army paired with the maximal troops to add. 
   * The maxTroops is filtered to igrnore changes that are irrelevant because they are higher than maxTroops of the army.
   */
  get armiesMax$(): Observable<[Army, number]>[] {
    let maxTroopsFiltered$ = this.remainingTroops$.pipe(distinctUntilChanged((prev, curr) => curr > this._nation.armies[0].maxTroops));
    return this._nation.armies$.map(army$ => combineLatest([army$, maxTroopsFiltered$]));
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


  constructor(private nations: NationService) {
    // let nationName = this.route.snapshot.paramMap.get('nationName');
    // this._nation = this.nations.picked.find(nation => nation.name === nationName) ?? this.nations.picked[0];
    // if (this.nations.picked.length > 1) {
      // this.paramSub = route.paramMap.subscribe(map => {
      //   nationName = map.get('nationName');
      //   if (this.nationName != nationName) {
      //     console.log('distributeComp: paramMap sends nationName: ', nationName);
      //     this._nation = this.nations.picked.find(nation => nation.name === nationName) ?? this.nations.picked[0];
      //     ref.markForCheck();
      //   }
      // });
    // }
  }

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
