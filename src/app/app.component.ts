import {Component, OnInit} from '@angular/core';
import {RestServiceService} from './services/rest-service.service';
import {World, Product, Pallier} from './world';
import {Subscription} from "rxjs";
import {GlobalMoneyServiceService} from "./services/global-money-service.service";
import {ProductService} from "./services/product.service";
import {ManagerService} from "./services/manager.service";
import {MatDialog} from "@angular/material/dialog";
import {ModalUsernameComponent} from "./modal-username/modal-username.component";
import {UpgradesService} from "./services/upgrades.service";
import {AchievementsService} from "./services/achievements.service";

export interface DialogData {
  username: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  world: World = new World();
  server: string;
  isClicked: boolean;
  globalMoneySubscription: Subscription;
  globalMoney: number;
  badgeManagers: number;
  username: string = "";
  badgeUpgrades: number;

  constructor(private service: RestServiceService,
              private gmService: GlobalMoneyServiceService,
              private productService: ProductService,
              private managerService: ManagerService,
              private upgradesService: UpgradesService,
              private achievementsService: AchievementsService,
              private dialog: MatDialog) {

    this.username = localStorage.getItem("username");
    if (this.username == "" || this.username == null || this.username == "null" || this.username == "undefined") {
      let random = Math.floor(Math.random() * 10000);
      this.username = "Marseillais" + random;
    }
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);


    this.server = service.getServer();
    service.getWorld().then(
      world => {
        this.world = world;

        console.log(this.world);
        this.globalMoney = this.world.money;
        this.gmService.setGlobalMoney(this.globalMoney);
        this.gmService.emitGlobalMoneySubject();
        this.productService.setProductList(this.world.products.product);
        this.productService.emitProductSubject();
        this.managerService.setManagerList(this.world.managers.pallier);
        this.managerService.emitManagerSubject();
        this.upgradesService.setUpgradesList(this.world.upgrades.pallier);
        this.upgradesService.emitUpgradesSubject();
        this.achievementsService.setAchievementsList(this.world.products.product);
        this.achievementsService.emitAchievementsSubject();
        this.badgeManagers = 0;
        this.badgeUpgrades = 0;
      }).then(
    );
  }

  ngOnInit() {
    // get the global money
    this.globalMoneySubscription = this.gmService.globalMoneySubject.subscribe(
      (globalMoney: number) => {
        this.globalMoney = globalMoney;
        this.getBuyableManagers();
        this.getBuyableUpgrades();
      }
    );
    this.gmService.emitGlobalMoneySubject();

    // managers calculation every 100ms
    setInterval(
      () => {
        this.getBuyableManagers();
      }, 3000
    );
  }

  getBuyableManagers() { //TODO appeler cette méthode au bon endroit (calcScore) => utiliser service ?
    this.badgeManagers = 0;
    for (let manager of this.world.managers.pallier) {
      if (this.globalMoney >= manager.seuil && !manager.unlocked) {
        this.badgeManagers++;
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalUsernameComponent, {
      data: {name: this.username}
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result == "" || result == null || result == "null" || result == "undefined") {
          let random = Math.floor(Math.random() * 10000);
          this.username = "Marseillais" + random;
        } else {
          this.username = result;
        }
        localStorage.setItem("username", this.username);
        this.service.setUser(this.username);
        location.reload();
      });
  }
  getBuyableUpgrades(){
    this.badgeUpgrades = 0;
    for (let upgrade of this.world.upgrades.pallier){
      if(this.globalMoney >= upgrade.seuil && !upgrade.unlocked){
        this.badgeUpgrades++;
      }
    }
  }

  onUsernameChanged() {
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
  }

}
