import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../world";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  product: Product;
  progressbarValue: number;
  timeleft: number;

  constructor() {}

  ngOnInit(): void {

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
    // gerer la progress bar, l'event click etc p30
    this.progressbarValue = 0;
  }

  calcScore(){

  }

}
