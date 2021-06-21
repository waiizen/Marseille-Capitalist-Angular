import { Component, OnInit } from '@angular/core';
import {Pallier, Product, World} from "../world";
import {RestServiceService} from "../services/rest-service.service";
import {GlobalMoneyServiceService} from "../services/global-money-service.service";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

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
  isDisabled: boolean;
  globalMoneySubscription: Subscription;
  //product: Product;

  constructor(private service: RestServiceService, private globalMoneyService: GlobalMoneyServiceService, private snackBar: MatSnackBar) {

    this.server = service.getServer();
    service.getWorld().then(
      world => {
        this.world = world;
        this.isDisabled = true;
      });
  }

  ngOnInit(): void {
    // get the global money
    this.globalMoneySubscription = this.globalMoneyService.globalMoneySubject.subscribe(
      (globalMoney: number) => {
        this.globalMoney = globalMoney;
      }
    );
    this.globalMoneyService.emitGlobalMoneySubject();
  }

  hireManager(manager: Pallier) {
    if (this.globalMoney >= manager.seuil){ // si on a assez d'argent pour acheter
      manager.unlocked = true;
      this.globalMoney = this.globalMoney - manager.seuil;
      this.globalMoneyService.setGlobalMoney(this.globalMoney);
      this.globalMoneyService.emitGlobalMoneySubject();
      this.popMessage(manager.name +" a été recruté !");
      //this.product.managerUnlocked = true;
    }else{
      manager.unlocked = false;
    }
  }

  setManager(manager: any){
    this.manager = manager;
    this.canBuy();
  }

  popMessage(message:string):void
  {
    this.snackBar.open(message,"",{duration:2000})
  }

  canBuy(){
    if (this.globalMoney < this.manager.seuil){
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }
}
