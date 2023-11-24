import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

import { NationService } from '@app/services/nation.service';
import { Nation } from '@app/services/model';

@Component({
  selector: 'app-nation-select',
  standalone: true,
  imports: [
    CommonModule,
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

  constructor(public nationService: NationService) {
    let formGrp: any = {};
    this.nationService.all.forEach(nation => {
      formGrp[nation.name] = new FormControl(false || null);
    });
    this.buttonToggles = new FormGroup(formGrp);
  }

  onSubmit(): void {
    if(this.buttonToggles.dirty && this.validChoice()) {
      this.nationService.all.forEach(nation => {
        if (this.buttonToggles.controls[nation.name].value == true) {
          this.nationService.picked.push(nation);
        }
      });
    }
  }

  private validChoice(): boolean {
    for(const nation of this.nationService.all.values()) {
      if (this.buttonToggles.controls[nation.name].value == true) {
        return true;
      }
    }
    return false;
  }
}
