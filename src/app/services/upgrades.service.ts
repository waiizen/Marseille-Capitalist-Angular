import { Injectable } from '@angular/core';
import {Pallier} from "../world";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UpgradesService {

  upgradesList: Pallier[] = [];

  upgradesSubject = new Subject<Pallier[]>();

  constructor() { }

  emitUpgradesSubject(){
    this.upgradesSubject.next(this.upgradesList);
  }

  setUpgradesList(upgradesList: any){
    this.upgradesList = upgradesList;
  }

}
