import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subscription, combineLatest, map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ArmyComponent } from "@components/army/army.component";
import { CancelDialogComponent } from '@dialogs/cancel/cancel-dialog.component';
import { NationComponent } from '@components/nation/nation.component';
import { NavComponent } from '@components/nav/nav.component';
import { AppStateService } from '@services/appState/appState.service';
import { NationService } from '@services/nation/nation.service';



/**
 * This main component has a header showing the nations name and a total troop count. Under this all armies are listed with the posibility 
 * to add and withdraw troops. This is directly represented in the total troop count above.
 * Child components are army and nav.
 */
@Component({
    selector: 'app-distribute',
    standalone: true,
    templateUrl: './distribute.component.html',
    styleUrl: './distribute.component.scss',
    imports: [
      ArmyComponent,
      CommonModule,
      MatButtonModule,
      MatIconModule,
      NavComponent
    ]
})
export class DistributeComponent extends NationComponent {

  private dialogSub?: Subscription;


  get first(): boolean {
    return this.index == 0;
  }

  /**
   * Returns this nations index in the NationService.picked array.
   */
  private get index(): number {
    return this.nations.picked.indexOf(this._nation);
  }

  get last(): boolean {
    return this.index == this.nations.picked.length -1;
  }

  /**
   * Returns true if every nation has maximal troops.
   */
  get ready(): Observable<boolean> {
    return combineLatest(this.nations.picked.map(n => n.troops$.pipe(map(tr => tr == n.maxTroops))))
      .pipe(map(trps => trps.every(ready => ready)));
  }


  constructor(nations: NationService, private dialog: MatDialog, private router: Router, private state: AppStateService) {
    super(nations);
  }


  nextNation() {
    this.router.navigate(['DistributeTroops', this.nations.picked[this.index +1].name]);
  }

  previousNation() {
    this.router.navigate(['DistributeTroops', this.nations.picked[this.index -1].name]);
  }

  onSubmit() {

  }

  onCancel() {
    let dialogRef = this.dialog.open(CancelDialogComponent, {
      data: { before: true }
    });
    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result?.cancel) {
        this.state.cancel();
      }
    })
  }

  override ngOnDestroy(): void {
    this.dialogSub?.unsubscribe();
    super.ngOnDestroy();
  }
}
