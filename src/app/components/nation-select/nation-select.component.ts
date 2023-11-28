import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

import { NationService } from '@app/services/nation.service';
import { Nation } from '@app/services/model';
import { AppStateService } from '@app/services/appState.service';

@Component({
  selector: 'app-nation-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  picked: any;
  picked2: Nation[] = [];
  @ViewChild('toggleGroup') private toggleGroup!: MatButtonToggleGroup;
  
  get nations(): IterableIterator<Nation> {
    return this.nationService.all.values();
  }


  constructor(private nationService: NationService, private appState: AppStateService) {
    this.picked = {};
    this.nationService.all.forEach(nation => {
      this.picked[nation.name] = false;
    });
    let formGrp: any = {};
    this.nationService.all.forEach(nation => {
      formGrp[nation.name] = new FormControl(false, Validators.required);
    });
    this.buttonToggles = new FormGroup(formGrp);
    console.log(this.picked);
    console.log(this.toggleGroup);
  }


  onSubmit(): void {
    console.log("Submit!");
    let i = 0;
    let p: Nation[] = [];
    console.log(this.picked);
    this.nationService.all.forEach(nation => {
      if (this.picked[nation.name] == true) {
        i++;
        p.push(nation);
      }
    });
    this.nationService.all.forEach(nation => {
      console.log(this.buttonToggles.controls[nation.name]);
      if (this.buttonToggles.get(nation.name)?.value == true) {
        i++;
        this.nationService.picked.push(nation);
        console.log("Picked " + nation.name);
      }
    });
    if (i >= 1) {
      this.nationService.picked = p;
      this.appState.stateCompleted();
    }
  }
}
