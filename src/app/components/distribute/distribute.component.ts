import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArmyComponent } from "@components/army/army.component";
import { NavComponent } from '@components/nav/nav.component';
import { NationComponent } from '../nation/nation.component';



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
      ArmyComponent,
      CommonModule,
      NavComponent
    ]
})
export class DistributeComponent extends NationComponent {

}
