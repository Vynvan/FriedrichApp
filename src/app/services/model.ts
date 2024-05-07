import { BehaviorSubject, Observable, Subject, combineLatest, connectable, from, map, mergeAll, share, shareReplay, tap } from "rxjs";


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
    private subjects = new Map<string, BehaviorSubject<Army>>();
    private updated = new Subject<Army>();
    armies: Army[];
    maxTroops: number;
    name: string;

    get armies$(): Observable<Army[]> {
        return combineLatest(Array.from(this.subjects.values()));
    }

    get updated$(): Observable<Army> {
        return this.updated as Observable<Army>;
    }

    get troops$(): Observable<number> {
        return this.armies$.pipe(
            map(armies => armies.map(a => a.troops)),
            map(troops => troops.reduce((prev, curr) => prev + curr, 0)));
    }


    constructor(n: Nation) {
        this.armies = n.armies;
        this.maxTroops = n.maxTroops;
        this.name = n.name;
        n.armies.forEach(a => this.subjects.set(a.name, new BehaviorSubject<Army>(a)));
    }


    updateArmy(army: Army): void {
        this.subjects.get(army.name)?.next(army);
        this.updated.next(army);
    }
}