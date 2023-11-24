import { Routes } from '@angular/router';
import { NationSelectComponent } from './components/nation-select/nation-select.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', component: AppComponent, children: [
        { path: 'NationSelect', component: NationSelectComponent }
    ]}
];
