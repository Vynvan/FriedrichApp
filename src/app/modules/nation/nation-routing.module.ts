import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NationComponent } from './components/nation/nation.component';
import { DistributeComponent } from './components/distribute/distribute.component';
import { IngameComponent } from './components/ingame/ingame.component';

const routes: Routes = [
  { path: '', component: NationComponent, children: [
    { path: '', component: IngameComponent },
    { path: 'Distribute', component: DistributeComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NationRoutingModule { }
