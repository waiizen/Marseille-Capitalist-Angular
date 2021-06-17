import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GlobalMoneyServiceService {

  private globalMoney:number;

  globalMoneySubject = new Subject<number>();

  constructor() { }

  // quand recoit de nouvelles données, émet ces données
  // dans le subject et appel cette méthode dans toutes
  // les méthodes qui en ont besoin
  emitGlobalMoneySubject(){
    this.globalMoneySubject.next(this.globalMoney);
  }

  setGlobalMoney(gm: number){
    this.globalMoney = gm;
  }

}
