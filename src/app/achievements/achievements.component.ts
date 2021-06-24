import { Component, OnInit } from '@angular/core';
import {Pallier, World} from "../world";
import {RestServiceService} from "../services/rest-service.service";
import {GlobalMoneyServiceService} from "../services/global-money-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProductService} from "../services/product.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {
  world: World = new World();
  private server: string;
  isDisabled: boolean;
  private globalMoneySubscription: Subscription;
  private globalMoney: number;
  unlock: Pallier;

  constructor(private service: RestServiceService,
              private globalMoneyService: GlobalMoneyServiceService,
              private snackBar: MatSnackBar,
              private productService: ProductService,
              //private managerService: ManagerService,
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
  }



}
