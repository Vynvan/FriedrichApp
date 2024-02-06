import { BehaviorSubject, Observable, combineLatest, map } from "rxjs";


export const dummy: Army = {
    name: 'dummy',
    maxTroops: 0,
    startsOn: 'dummy',
    troops: 0
}

export interface General {
    name: string;
    maxTroops: number;
    startsOn: string;
}

export interface Army extends General {
    troops: number;
}

export interface Nation {
    armies: Army[];
    maxTroops: number;
    name: string;
}

export class Nation$ implements Nation {
    armies: Army[];
    maxTroops: number;
    name: string;

    armies$: Observable<Army>[];
    private _subjects = new Map<string, BehaviorSubject<Army>>();

    get troops$(): Observable<number> {
        return combineLatest(this.armies$).pipe(
            map(armies => armies.map(a => a.troops)),
            map(troops => troops.reduce((prev, curr) => prev + curr, 0)));
    }
  
    constructor(n: Nation) {
        this.armies = n.armies;
        this.maxTroops = n.maxTroops;
        this.name = n.name;
        this.armies$ = [];
        n.armies.forEach(a => {
            const bs = new BehaviorSubject<Army>(a);
            this._subjects.set(a.name, bs);
            this.armies$.push(bs.asObservable());
        });
    }

    updateArmy(army: Army): void {
        const i = this.armies.findIndex(a => a.name === army.name);
        if (i != -1) {
            this.armies[i] = army;
        }
        this._subjects.get(army.name)?.next(army);
    }
}