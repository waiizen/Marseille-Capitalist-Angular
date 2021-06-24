import {Component, OnInit} from '@angular/core';
import {Pallier, Product, World} from "../world";
import {RestServiceService} from "../services/rest-service.service";
import {GlobalMoneyServiceService} from "../services/global-money-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProductService} from "../services/product.service";
import {Subscription} from "rxjs";
import {AchievementsService} from "../services/achievements.service";
import {ManagerService} from "../services/manager.service";

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {
  world: World = new World();
  server: string;
  isDisabled: boolean;
  globalMoneySubscription: Subscription;
  globalMoney: number;
  unlock: Pallier;
  achievementsSubscription: Subscription;
  achievementsList: Product[] = [];

  constructor(private service: RestServiceService,
              private globalMoneyService: GlobalMoneyServiceService,
              private snackBar: MatSnackBar,
              private productService: ProductService,
              private achievementsService: AchievementsService,
              private managerService: ManagerService) {

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
    this.achievementsSubscription = this.achievementsService.achievementsSubject.subscribe(
      (achievementsList: any) => {
        this.achievementsList = achievementsList;
      }
    );
    this.achievementsService.emitAchievementsSubject();
  }


}
