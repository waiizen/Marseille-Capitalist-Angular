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

  constructor(private service: RestServiceService, private gmService: GlobalMoneyServiceService) {
    this.server = service.getServer();
    service.getWorld().then(
      world => {
        this.world = world;
        this.globalMoney = this.world.money;
        this.gmService.setGlobalMoney(this.globalMoney);
        this.gmService.emitGlobalMoneySubject();
      }).then(
    );
  }

  ngOnInit(){
  }

}
