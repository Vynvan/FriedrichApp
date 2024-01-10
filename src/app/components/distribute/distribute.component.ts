import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { Army, Nation$ } from '@app/services/model';
import { NationService } from '@app/services/nation.service';
import { ArmyComponent } from '../army/army.component';
import { NavComponent } from '../nav/nav.component';


/**
 * This main component has a header showing the nations name and a total troop count. Under this all armies are listed with the posibility 
 * to add and withdraw troops. This is directly represented in the total troop count above.
 * Child components are army and nav.
 */
@Component({
  selector: 'app-distribute',
  standalone: true,
  imports: [
    CommonModule,
    ArmyComponent,
    NavComponent
],
  templateUrl: './distribute.component.html',
  styleUrl: './distribute.component.scss'
})
export class DistributeComponent {

  private _nation!: Nation$;
  // private _possibleTroops$!: ReplaySubject<number>;
  // private troopSub?: Subscription;

  // get armies$(): [Observable<Army>, Observable<number>][] {
  //   return this._nation.armies$.map(army => [army, this.troops$.pipe<number>(map(count => this._nation.maxTroops - count))]);
  // }

  get armiesMax$(): Observable<[Army, number]>[] {
    return this._nation.armies$.map(army$ => combineLatest([army$, this._nation.troops$]));
  }

  get maxTroops(): number {
    return this._nation.maxTroops;
  }

  get nationName(): string {
    return this._nation.name;
  }

  get troops$(): Observable<number> {
    return this._nation.troops$;
  }


  constructor(private nations: NationService, private route: ActivatedRoute) {
    let nationName = this.route.snapshot.paramMap.get('nationName');
    this._nation = this.nations.picked.find(nation => nation.name === nationName) ?? this.nations.picked[0] ?? this.nations.picked[0];
    // this.route.params.subscribe(params => {
    //   this._nation = params['nationName'] 
    //   ? this.nations.picked.find(nation => nation.name === params['nationName']) ?? this.nations.picked[0] 
    //   : this.nations.picked[0];
    // });
    // this._possibleTroops$ = new ReplaySubject<number>(1);
    // this.troopSub = this.troopCount$.subscribe(count => {
    //   this._possibleTroops$.next(this._nation.maxTroops - count);
    // });
  }

  /**
   * Calls the 'updateArmy' function of the nation object.
   * @param updated 
   */
  updateArmy(updated: Army) {
    console.log(`New army size: ${updated.troops}`);
    this._nation.updateArmy(updated);
  }

  // ngOnDestroy() {
  //   this.troopSub?.unsubscribe();
  // }
}
