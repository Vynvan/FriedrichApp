import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NationSelectComponent } from './components/nation-select/nation-select.component';


export const routes: Routes = [
    { path: '', component: AppComponent, children: [
        { path: 'NationSelect', component: NationSelectComponent },
        { path: ':nationName', loadChildren: () => import('./modules/nation/nation.module').then(m => m.NationModule) }
    ]}
];
