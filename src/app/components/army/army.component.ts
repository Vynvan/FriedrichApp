import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Army } from '@app/services/model';

@Component({
  selector: 'app-components.army',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './army.component.html',
  styleUrl: './army.component.scss'
})
export class ArmyComponent {

  @Input({ required: true })
  army: Army | undefined;
  

  constructor() {
  }
}
