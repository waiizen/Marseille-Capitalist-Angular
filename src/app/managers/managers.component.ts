import { Component, OnInit } from '@angular/core';
import {Pallier, World} from "../world";
import {RestServiceService} from "../services/rest-service.service";

@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.scss']
})
export class ManagersComponent implements OnInit {
  world: World = new World();
  server: string;
  globalMoney: number;
  manager: Pallier;

  constructor(private service: RestServiceService) {

    this.server = service.getServer();
    service.getWorld().then(
      world => {
        this.world = world;
      });
  }
  ngOnInit(): void {
  }

  hireManager(manager: Pallier) {
    if (this.globalMoney >= manager.seuil){ // si on a assez d'argent pour acheter
      this.globalMoney -= manager.seuil;
      return manager.unlocked = true;
    }
    return manager.unlocked = false;

  }

  setManager(manager: any){
    this.manager = manager;

    this.canBuy();
  }

  canBuy(){
    console.log(this.manager.unlocked);
    if (this.globalMoney < this.manager.seuil){
      this.manager.unlocked = false;
    } else {
      this.manager.unlocked = true;
    }
  }


}
