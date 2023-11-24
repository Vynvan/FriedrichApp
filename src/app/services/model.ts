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