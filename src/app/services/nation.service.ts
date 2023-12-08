import { Injectable } from '@angular/core';

import { Nation, Nation$ } from './model';


@Injectable({
  providedIn: 'root'
})
export class NationService {

  all: Map<string, Nation>;
  picked: Nation[] = [];

  private _picked: Nation$[] = [];
  get picked$(): Nation$[] {
    if (!this._picked) {
      this.picked.forEach(nation => this._picked.push(new Nation$(nation)));
    }
    return this._picked;
  };

  constructor() {
    let nations = [
      NationService.initPrussia(),
      NationService.initHannover(),
      NationService.initAustria(),
      NationService.initImperialArmy(),
      NationService.initRussia(),
      NationService.initSweden(),
      NationService.initFrance()
    ];
    this.all = new Map<string, Nation>();
    nations.forEach(n => this.all.set(n.name, n));
  }

  private static initAustria(): Nation {
    return {
      name: "Austria",
      maxTroops: 30,
      armies: [
        { name: "Daun", maxTroops: 8, startsOn: "K1", troops: 1 },
        { name: "Browne", maxTroops: 8, startsOn: "H2", troops: 1 },
        { name: "Karl von Lothringen", maxTroops: 8, startsOn: "H2", troops: 1 },
        { name: "Laudon", maxTroops: 8, startsOn: "L1", troops: 1 },
        { name: "Lacy", maxTroops: 8, startsOn: "H1", troops: 1 },
      ]
    }
  }

  private static initHannover(): Nation {
    return {
      name: "Hannover",
      maxTroops: 12,
      armies: [
        { name: "Ferdinand v. Brswg.", maxTroops: 8, startsOn: "B8", troops: 1 },
        { name: " Cumberland", maxTroops: 8, startsOn: "C5", troops: 1 }
      ]
    }
  }

  private static initFrance(): Nation {
    return {
      name: "France",
      maxTroops: 20,
      armies: [
        { name: "Richelieu", maxTroops: 8, startsOn: "A4", troops: 1 },
        { name: "Soubise", maxTroops: 8, startsOn: "B3", troops: 1 },
        { name: "Chevert", maxTroops: 8, startsOn: "A4", troops: 1 },
      ]
    }
  }

  private static initImperialArmy(): Nation {
    return {
      name: "ImperialArmy",
      maxTroops: 6,
      armies: [
        { name: "Hildburghausen", maxTroops: 6, startsOn: "D2", troops: 6 }
      ]
    }
  }

  private static initPrussia(): Nation {
    return {
      name: "Prussia",
      maxTroops: 32,
      armies: [
        { name: "Friedrich der Große", maxTroops: 8, startsOn: "F4", troops: 1 },
        { name: "Winterfeldt", maxTroops: 8, startsOn: "F4", troops: 1 },
        { name: "Prinz Heinrich", maxTroops: 8, startsOn: "G6", troops: 1 },
        { name: "Schwerin", maxTroops: 8, startsOn: "K3", troops: 1 },
        { name: "Keith", maxTroops: 8, startsOn: "K3", troops: 1 },
        { name: "Seydlitz", maxTroops: 8, startsOn: "F6", troops: 1 },
        { name: "Dohna", maxTroops: 8, startsOn: "I7", troops: 1 },
        { name: "Lehwaldt", maxTroops: 8, startsOn: "M9", troops: 1 }
      ]
    }
  }

  private static initRussia(): Nation {
    return {
      name: "Russia",
      maxTroops: 16,
      armies: [
        { name: "Saltikov", maxTroops: 8, startsOn: "L7", troops: 1 },
        { name: "Fermor", maxTroops: 8, startsOn: "L7", troops: 1 },
        { name: "Apraxin", maxTroops: 8, startsOn: "O7", troops: 1 },
        { name: "Tottleben", maxTroops: 8, startsOn: "M7", troops: 1 }
      ]
    }
  }

  private static initSweden(): Nation {
    return {
      name: "Sweden",
      maxTroops: 4,
      armies: [
        { name: "Ehrensvärd", maxTroops: 4, startsOn: "F9", troops: 4 }
      ]
    }
  }

}
