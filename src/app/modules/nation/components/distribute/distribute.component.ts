import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, combineLatest, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { CancelDialogComponent } from '@dialogs/cancel/cancel-dialog.component';
import { Nation$ } from '@services/model';
import { GameStateService } from '@services/gameState/gameState.service';
import { SessionService } from '@services/session/session.service';



/**
 * This main component has a header showing the nations name and a total troop count. Below it all armies are listed 
 * with the posibility to add and withdraw troops. This is directly represented in the total troop count above.
 * Child components are army and nav.
 */
@Component({
    selector: 'app-distribute',
    standalone: false,
    templateUrl: './distribute.component.html',
    styleUrl: './distribute.component.scss',
})
export class DistributeComponent implements OnDestroy {

  private dialogSub?: Subscription;
  private nation!: Nation$;


  @Input()
  set nationName(name: string) {
    this.nation = this.session.pickedNations.find(nation => nation.name === name) ?? this.session.pickedNations[0];
  }

  get first(): boolean {
    return this.index === 0;
  }

  /**
   * Returns this nations index in the NationService.picked array.
   */
  private get index(): number {
    return this.session.pickedNations.indexOf(this.nation);
  }

  get last(): boolean {
    return this.index == this.session.pickedNations.length -1;
  }

  /**
   * Returns true if every nation has maximal troops.
   */
  get ready(): Observable<boolean> {
    return combineLatest(this.session.pickedNations.map(n => n.troops$.pipe(map(tr => tr == n.maxTroops))))
      .pipe(map(trps => trps.every(ready => ready)));
  }


  constructor(private session: SessionService, private dialog: MatDialog, private router: Router, private state: GameStateService) { }


  nextNation() {
    this.router.navigate([this.session.pickedNations[this.index +1].name, 'Distribute']);
  }

  previousNation() {
    this.router.navigate([this.session.pickedNations[this.index -1].name, 'Distribute']);
  }

  onCancel() {
    const dialogRef = this.dialog.open(CancelDialogComponent, {
      data: { before: true }
    });
    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result?.cancel) {
        this.state.cancel();
      }
    });
  }

  onSubmit() {
    this.state.stateCompleted();
  }

  ngOnDestroy(): void {
    this.dialogSub?.unsubscribe();
  }
}
