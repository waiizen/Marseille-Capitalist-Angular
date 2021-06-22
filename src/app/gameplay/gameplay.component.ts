import { Component, OnInit } from '@angular/core';
import { World, Product, Pallier } from '../world';
import {RestServiceService} from "../services/rest-service.service";
import {ProductService} from "../services/product.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.scss']
})
export class GameplayComponent implements OnInit {

  world: World = new World();
  server: string;
  tabMulti: Array<string> = ["x1", "x10", "x100", "Max"];
  currentMulti = this.tabMulti[0];
  productSubscription: Subscription;
  productList: Product[];

  constructor(private service: RestServiceService,
              private productService: ProductService) {

    this.server = service.getServer();
    service.getWorld().then(
      world => {
        this.world = world;
      });

  }

  ngOnInit(): void {
    this.productSubscription = this.productService.productSubject.subscribe(
      (productList: Product[]) => {
        this.productList = productList;
      }
    );
    this.productService.emitProductSubject();
  }

  onChangeValueMultiplier() {
    switch (this.currentMulti) {
      case this.tabMulti[0]:
        this.currentMulti = this.tabMulti[1];
        break;

      case this.tabMulti[1]:
        this.currentMulti = this.tabMulti[2];
        break;

      case this.tabMulti[2]:
        this.currentMulti = this.tabMulti[3];
        break;

      case this.tabMulti[3]:
        this.currentMulti = this.tabMulti[0];
        break;

    }
  }



}
