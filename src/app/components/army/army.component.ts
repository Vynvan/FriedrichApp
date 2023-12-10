import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, EMPTY, Observable, flatMap, map, mergeMap, throwError } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Army } from '@app/services/model';

@Component({
  selector: 'app-components.army',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './army.component.html',
  styleUrl: './army.component.scss'
})
export class ArmyComponent {

  @Input({ required: true }) 
  army$: Observable<Army> = throwError(() => new Error("No Army in observable"));

  @Input({ required: false })
  editMode: boolean = false;


  get name$(): Observable<string> {
    return this.army$.pipe(map(a => a.name));
  }

  get startsOn$(): Observable<string> {
    return this.army$.pipe(map(a => a.startsOn));
  }

  get troops$(): Observable<[number, number]> {
    return this.army$.pipe(map(a => [a.troops, a.maxTroops]));
  }

  private _troops: BehaviorSubject<[number, boolean][]>;
  get troopStates$(): Observable<[number, boolean][]> {
    return this._troops.asObservable() ?? EMPTY;
  }


  constructor() {
    const ar: [number, boolean][] = [];
    this._troops = new BehaviorSubject(ar);
    this.army$.subscribe(newArmy => {
      for (let i = 0; i < newArmy.troops; i++)
        ar.push([i, true]);
      if (this.editMode) {
        for (let i = newArmy.troops; i < newArmy.maxTroops; i++)
          ar.push([i, false]);
      }
      this._troops.next(ar);
    });
  }

  onClick(troop: [number, boolean]) {
    if (this.editMode) {
      const prev = this._troops.getValue();
      prev.find(val => val[0] === troop[0])?.[1] = troop[1];
      this._troops.next(prev);
    }
  }
}
