import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../world";
import {RestServiceService} from "../services/rest-service.service";
import {Subscription} from "rxjs";
import {GlobalMoneyServiceService} from "../services/global-money-service.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  product: Product;
  progressbarValue: number;
  lastUpdate: number;
  server: string;
  globalMoneySubscription: Subscription;
  globalMoney: number;

  constructor(private service: RestServiceService, private globalMoneyService: GlobalMoneyServiceService) {
    this.server = service.getServer();
  }

  ngOnInit(): void {

    // get the global money
    this.globalMoneySubscription = this.globalMoneyService.globalMoneySubject.subscribe(
      (globalMoney: number) => {
        this.globalMoney = globalMoney;
      }
    );
    this.globalMoneyService.emitGlobalMoneySubject();


    // score's calculation every 100ms
    setInterval(
      () => {
        this.calcScore();
      }, 100
    );
  }

  @Input()
  set produit(value: Product) {
    this.product = value;
  }

  startFabrication(){
    this.product.timeleft = this.product.vitesse;
    this.lastUpdate = Date.now();
  }

  calcScore(){
    if(this.product.timeleft != 0){
      if(this.product.timeleft > 0) { // si timeleft est supérieur à 0
        this.product.timeleft = this.product.timeleft - (Date.now() - this.lastUpdate);
        this.lastUpdate = Date.now();
        this.progressbarValue =  ((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100;
      } else { // end
        this.product.timeleft = 0;
        this.progressbarValue = 0;
        this.globalMoney += this.product.revenu;
        this.globalMoneyService.setGlobalMoney(this.globalMoney);
        this.globalMoneyService.emitGlobalMoneySubject();
      }
    }
  }

}
