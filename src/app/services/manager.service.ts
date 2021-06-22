import { Injectable } from '@angular/core';
import { Pallier} from "../world";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  managerList: Pallier[] = [];

  managerSubject = new Subject<Pallier[]>();

  constructor() { }

  emitManagerSubject(){
    this.managerSubject.next(this.managerList);
  }

  setManagerList(managerList: any){
    this.managerList = managerList;
  }

}
