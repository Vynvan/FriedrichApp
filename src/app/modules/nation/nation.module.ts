import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { NavComponent } from '@components/nav/nav.component';
import { ArmyComponent } from './components/army/army.component';
import { DistributeComponent } from './components/distribute/distribute.component';
import { IngameComponent } from './components/ingame/ingame.component';
import { NationComponent } from './components/nation/nation.component';
import { NationRoutingModule } from './nation-routing.module';


@NgModule({
  declarations: [
    ArmyComponent,
    DistributeComponent,
    IngameComponent,
    NationComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NationRoutingModule,
    NavComponent,
    RouterOutlet
  ]
})
export class NationModule { }