interface General {
    name: string;
    maxTroops: number;
    startsOn: string;
}

interface Army extends General {
    troops: number;
}

interface Nation {
    armies: Army[];
    maxTroops: number;
    name: string;
}