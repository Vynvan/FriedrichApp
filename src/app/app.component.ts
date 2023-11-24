import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NationService } from './services/nation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FriedrichApp';

  constructor(private nationService: NationService, private router: Router) {
    if(this.nationService.picked.length == 0) {
      this.router.navigate(['NationSelect']);
    }
  }
}
