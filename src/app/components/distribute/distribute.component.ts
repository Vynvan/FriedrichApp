import { Component, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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

  // @ContentChild('#nav') nav!: NavComponent;  
  get armies$(): Observable<Army>[] {
    return this._nation.armies$
  }

  get nationName(): string {
    return this._nation.name;
  }

  get troopCount$(): Observable<number> {
    return combineLatest(this.armies$).pipe(
      map(army => army.map(a => a.troops)),
      map(troops => troops.reduce((prev, curr) => prev + curr))
    );
  }

  private _nation!: Nation$;


  constructor(private nations: NationService, private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      if (params.has('nationName')) {
        this._nation = this.nations.picked.find(nation => nation.name === params.get('nationName')) ?? this.nations.picked[0];
      }
    });
  }

  ngOnInit(): void {
  }

  /**
   * Calls the 'updateArmy' function of the nation object.
   * @param updated 
   */
  updateArmy(updated: Army) {
    this._nation.updateArmy(updated);
  }
}
