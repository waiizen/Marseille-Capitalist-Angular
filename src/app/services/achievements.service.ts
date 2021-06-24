import { Injectable } from '@angular/core';
import {Pallier, Product} from "../world";
import {Subject} from "rxjs";
import {ProductService} from "./product.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AchievementsService {

  achievementsList: Product[] = [];

  achievementsSubject = new Subject<Product[]>();

  constructor(private productService: ProductService,
              private snackBar: MatSnackBar) { }

  emitAchievementsSubject(){
    this.achievementsSubject.next(this.achievementsList);
  }

  setAchievementsList(achievementsList: any){
    this.achievementsList = achievementsList;
  }

  getFirstAchievement(idProd: number, qtt: number){
    for(let achiList of this.achievementsList){
      for(let achi of achiList.palliers.pallier ){
        if(achi.idcible == idProd){
          // si on doit débloquer le succes
          if(qtt >= achi.seuil && !achi.unlocked){
            achi.unlocked = true;
            this.productService.setProductAfterUpgrade(achi.idcible, achi.typeratio, achi.ratio);
            this.popMessage(achi.name +" a été recruté !");
          }
        }
      }
    }
  }

  popMessage(message:string):void
  {
    this.snackBar.open(message,"",{duration:2000})
  }

}
