import { Component, OnInit } from '@angular/core';
import {Pallier, World} from "../world";
import {RestServiceService} from "../services/rest-service.service";
import {GlobalMoneyServiceService} from "../services/global-money-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProductService} from "../services/product.service";
import {Subscription} from "rxjs";
import {UpgradesService} from "../services/upgrades.service";

@Component({
  selector: 'app-upgrades',
  templateUrl: './upgrades.component.html',
  styleUrls: ['./upgrades.component.scss']
})
export class UpgradesComponent implements OnInit {
  world: World = new World();
  globalMoney: number;
  server: string;
  globalMoneySubscription: Subscription;
  isDisabled: any;
  upgrade : Pallier;
  upgradesSubscription: Subscription;
  upgradesList: Pallier[];

  constructor(private service: RestServiceService,
              private globalMoneyService: GlobalMoneyServiceService,
              private snackBar: MatSnackBar,
              private productService: ProductService,
              private upgradesService: UpgradesService) {

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

    // get the upgrades
    this.upgradesSubscription = this.upgradesService.upgradesSubject.subscribe(
      (upgradeList: Pallier[]) => {
        this.upgradesList = upgradeList;
      }
    );
    this.upgradesService.emitUpgradesSubject();
  }
  getProductName(id: number){
    return this.productService.getProductName(id);
  }

  upgradeProd(upgrade: Pallier) {
    if (this.globalMoney >= upgrade.seuil) { // si on a assez d'argent pour acheter
      upgrade.unlocked = true;
      this.globalMoney = this.globalMoney - upgrade.seuil;
      this.globalMoneyService.setGlobalMoney(this.globalMoney);
      this.globalMoneyService.emitGlobalMoneySubject();
      this.productService.setProductAfterUpgrade(upgrade.idcible, upgrade.typeratio, upgrade.ratio);
      this.popMessage("Vous avez acheté "+upgrade.name);
      this.upgradesService.emitUpgradesSubject();
      this.service.putUpgrade(upgrade);
    }else{
      upgrade.unlocked = false;
    }
  }
  setUpgrade(upgrade: any){
    this.upgrade = upgrade;
    this.canBuy();
  }

  popMessage(message:string):void
  {
    this.snackBar.open(message,"",{duration:2000})
  }

  canBuy(){
    if (this.globalMoney < this.upgrade.seuil){
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }
}
