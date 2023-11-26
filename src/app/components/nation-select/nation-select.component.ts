import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

import { NationService } from '@app/services/nation.service';
import { Nation } from '@app/services/model';
import { AppStateService } from '@app/services/appState.service';

@Component({
  selector: 'app-nation-select',
  standalone: true,
  imports: [
    CommonModule,
    // FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './nation-select.component.html',
  styleUrl: './nation-select.component.scss'
})
export class NationSelectComponent {
  
  buttonToggles: FormGroup;
  
  get nations(): IterableIterator<Nation> {
    return this.nationService.all.values();
  }


  constructor(private nationService: NationService, private appState: AppStateService) {
    let formGrp: any = {};
    this.nationService.all.forEach(nation => {
      formGrp[nation.name] = new FormControl(false);
    });
    this.buttonToggles = new FormGroup(formGrp);
  }


  onSubmit(): void {
    console.log("Submit!");
    let picked = 0;
    this.nationService.all.forEach(nation => {
      console.log(this.buttonToggles.value);
      if (this.buttonToggles.controls[nation.name].value == true) {
        picked++;
        this.nationService.picked.push(nation);
        console.log("Picked " + nation.name);
      }
    });
    if (picked >= 1)
      this.appState.stateCompleted();
  }
}
