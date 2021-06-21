import {Component, OnInit} from '@angular/core';
import { RestServiceService } from './services/rest-service.service';
import { World, Product, Pallier } from './world';
import {Subscription} from "rxjs";
import {GlobalMoneyServiceService} from "./services/global-money-service.service";

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
  username: any;

  constructor(private service: RestServiceService, private gmService: GlobalMoneyServiceService) {
    this.server = service.getServer();
    service.getWorld().then(
      world => {
        this.world = world;
        this.globalMoney = this.world.money;
        this.gmService.setGlobalMoney(this.globalMoney);
        this.gmService.emitGlobalMoneySubject();
        this.badgeManagers = 0;
      }).then(
    );
  }

  ngOnInit(){
    // get the global money
    this.globalMoneySubscription = this.gmService.globalMoneySubject.subscribe(
      (globalMoney: number) => {
        this.globalMoney = globalMoney;
      }
    );
    this.gmService.emitGlobalMoneySubject();
    this.username= localStorage.getItem("username");
    if (this.username == ""){
      let random = Math.floor(Math.random() * 10000);
      this.username = "Marseillais"+random;
      localStorage.setItem("username", this.username);
    }
    localStorage.setItem("username", this.username);
    // managers calculation every 100ms
    /*setInterval(
      () => {
        this.getBuyableManagers();
      }, 3000
    );*/
  }

  getBuyableManagers(){ //TODO appeler cette méthode au bon endroit (calcScore) => utiliser service ?
    for (let manager of this.world.managers.pallier){
      console.log(manager);
      if(this.globalMoney >= manager.seuil){
        this.badgeManagers++;
        console.log(this.badgeManagers);
      }
    }
  }

  onUsernameChanged() {
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
  }
}
