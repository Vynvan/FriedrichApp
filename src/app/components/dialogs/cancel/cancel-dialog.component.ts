import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-cancel-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cancel-dialog.component.html',
  styleUrl: './cancel-dialog.component.scss'
})
export class CancelDialogComponent {

  beforeGame = 'die Spielerstellung';
  duringGame = 'das Spiel';
  text: string;


  constructor(public dialogRef: MatDialogRef<CancelDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.text = `Sind Sie sicher, dass Sie ${(this.data.before) ? this.beforeGame : this.duringGame} verlassen wollen?`;
  }

  onCancel() {
    this.dialogRef.close({ cancel: false });
  }

  onSubmit() {
    this.dialogRef.close({ cancel: true });
  }
}
