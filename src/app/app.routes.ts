import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NationSelectComponent } from './components/nation-select/nation-select.component';
import { DistributeComponent } from './components/distribute/distribute.component';


export const routes: Routes = [
    { path: '', component: AppComponent, children: [
        { path: 'NationSelect', component: NationSelectComponent },
        { path: 'DistributeTroops', component: DistributeComponent }
    ]}
];
