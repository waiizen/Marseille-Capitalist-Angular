import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../world";
import {RestServiceService} from "../services/rest-service.service";

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

  constructor(private service: RestServiceService) {
    this.server = service.getServer();
  }

  ngOnInit(): void {

    //this.product.timeleft = 0;

    // score's calculation every 100ms
    /*
    setInterval(
      () => {
        this.calcScore();
      }, 1000
    );

     */
  }

  @Input()
  set produit(value: Product) {
    this.product = value;
  }

  startFabrication(){
    this.product.vitesse = 3000;
    this.progressbarValue = 0;
    this.lastUpdate = Date.now();
    this.product.timeleft = this.product.vitesse;
    alert('ok');
  }

  calcScore(){
    if(this.product.timeleft != 0){
      while(this.product.timeleft > 0) { // tant que timeleft est supérieur à 0
        this.product.timeleft = this.product.timeleft - (Date.now() - this.lastUpdate);
        this.lastUpdate = Date.now();
        this.progressbarValue = ((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100
      }
      //TODO ajouter l'argent
      this.progressbarValue = 0;
    }
  }

}
