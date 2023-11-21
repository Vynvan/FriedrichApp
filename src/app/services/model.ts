interface General {
    name: string;
    maxTroops: number;
    minTroops?: number;
}

interface Army extends General {
    troops: number;
}

interface Nation {
    armies: Army[];
    maxTroops: number;
}