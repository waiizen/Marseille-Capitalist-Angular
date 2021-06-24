import { Component, OnInit } from '@angular/core';
import {Pallier, Product, World} from "../world";
import {RestServiceService} from "../services/rest-service.service";
import {GlobalMoneyServiceService} from "../services/global-money-service.service";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProductService} from "../services/product.service";
import {ManagerService} from "../services/manager.service";
import {HttpClient} from "@angular/common/http";

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
  managerSubscription: Subscription;
  managerList: Pallier[];

  constructor(private service: RestServiceService,
              private globalMoneyService: GlobalMoneyServiceService,
              private snackBar: MatSnackBar,
              private productService: ProductService,
              private managerService: ManagerService,
              ) {

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

    // get the manager
    this.managerSubscription = this.managerService.managerSubject.subscribe(
      (managerList: Pallier[]) => {
        this.managerList = managerList;
      }
    );
    this.managerService.emitManagerSubject();

  }

  hireManager(manager: Pallier) {
    if (this.globalMoney >= manager.seuil){ // si on a assez d'argent pour acheter
      manager.unlocked = true;
      this.globalMoney = this.globalMoney - manager.seuil;
      this.globalMoneyService.setGlobalMoney(this.globalMoney);
      this.globalMoneyService.emitGlobalMoneySubject();
      this.productService.setManagerUnlocked(manager.idcible);
      this.productService.emitProductSubject();
      this.popMessage(manager.name +" a été recruté !");
      this.service.putManager(manager);
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

  getProductName(id: number){
    return this.productService.getProductName(id);
  }
}
