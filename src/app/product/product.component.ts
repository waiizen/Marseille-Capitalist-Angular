import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../world";
import {RestServiceService} from "../services/rest-service.service";
import {Subscription} from "rxjs";
import {GlobalMoneyServiceService} from "../services/global-money-service.service";
import {AppComponent} from "../app.component";
import {main} from "@angular/compiler-cli/src/main";

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
  inFabrication: boolean = false;
  _currentMulti: string;
  buyable: boolean = false;
  initialRevenu: number;h
  affichagePrix: number;
  initialPrice: number;
  visibilityBadge: boolean = false;
  maxQtt: number = 0;
  qttToBuy: number = 1;
  isAvailable = false;

  @Input()
  set currentMulti(value: string) {
    this._currentMulti = value;
    this.onChangeValueMultiplier();
  }

  @Input()
  set produit(value: Product) {
    this.product = value;
    this.initialPrice = this.product.cout;
    this.updateAffichagePrix();
    this.initialRevenu = this.product.revenu;
  }

  constructor(private service: RestServiceService, private globalMoneyService: GlobalMoneyServiceService) {
    this.server = service.getServer();
  }

  ngOnInit(): void {
    // get the global money
    this.globalMoneySubscription = this.globalMoneyService.globalMoneySubject.subscribe(
      (globalMoney: number) => {
        this.globalMoney = globalMoney;
        this.canBuy();
      }
    );
    this.globalMoneyService.emitGlobalMoneySubject();

    // score's calculation every 100ms
    setInterval(
      () => {
        this.calcScore();
      }, 100
    );

    this.checkAvailibility();
  }

  /**
   * Méthode qui lance la fabrication
   */
  startFabrication() {
    if (!this.inFabrication && this.product.quantite > 0) {
      this.product.timeleft = this.product.vitesse;
      this.lastUpdate = Date.now();
      this.inFabrication = true;
    }
  }

  /**
   * Méthode qui calcule le score du produit en cours de fabrication
   */
  calcScore() {
    if (this.product.timeleft != 0) {
      if (this.product.timeleft > 0) { // si timeleft est supérieur à 0
        this.product.timeleft = this.product.timeleft - (Date.now() - this.lastUpdate);
        this.lastUpdate = Date.now();
        this.progressbarValue = ((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100;
      } else { // end
        this.product.timeleft = 0;
        this.progressbarValue = 0;
        this.globalMoney += this.product.revenu;
        this.globalMoneyService.setGlobalMoney(this.globalMoney);
        this.globalMoneyService.emitGlobalMoneySubject();
        this.inFabrication = false;
      }
    }
    if (this.product.managerUnlocked) {//TODO si le manager pour ce produit est débloqué (à implémenter pcq je sais pas comment faire avec le manager component)
      // quand timeleft == 0
      // this.product.startFabrication();
    }

  }

  /**
   * Méthode qui s'execute au changement du multiplicateur
   */
  onChangeValueMultiplier() {
    let r = this.product.croissance;
    this.visibilityBadge = false;
    switch (this._currentMulti) {
      case "x1":
        this.affichagePrix = this.product.cout;
        this.qttToBuy = 1;
        break;

      case "x10":
        console.log("10//"+"PC: "+this.product.cout + " r: "+r);
        console.log(((this.product.cout*(1-Math.pow(r, 10)))/(1-r)));
        this.affichagePrix = ((this.product.cout*(1-Math.pow(r, 10)))/(1-r));
        this.qttToBuy = 10;
        break;

      case "x100":
        console.log("100//"+"PC: "+this.product.cout + " r: "+r);
        console.log(((this.product.cout*(1-Math.pow(r, 100)))/(1-r)));
        this.affichagePrix = ((this.product.cout*(1-Math.pow(r, 100)))/(1-r));
        this.qttToBuy = 100;
        break;

      case "Max":
        this.maxQtt = Math.trunc(this.calcMaxCanBuy());
        if(this.maxQtt > 0) {
          this.visibilityBadge = true;
          this.affichagePrix = ((this.product.cout * (1 - Math.pow(r, this.maxQtt))) / (1 - r));
        }

        break;
    }
    this.canBuy();
  }

  /**
   * Méthode qui vérifie si on peut acheter le produit en fonction de notre argent
   * Desactive si pas assez, active sinon
   */
  canBuy() {
    if (this.affichagePrix <= this.globalMoney) this.buyable = true;
    else this.buyable = false;
  }

  /**
   * Méthode qui s'execute lorsqu'on achete un produit
   */
  onBuy() {
    // update de l'argent du joueur
    this.globalMoneyService.setGlobalMoney(this.globalMoney - this.affichagePrix);
    this.globalMoneyService.emitGlobalMoneySubject();
    // ajoute une quantité au produit
    this.product.quantite += this.qttToBuy;
    // si nouveau produit, degrise
    this.checkAvailibility();
    // calcul du cout du prochain produit
    this.calcProchainCout(this.product.quantite);
    // calcul du nouveau revenu
    this.calcNewRevenu();
    // update l'affichage du prix en fonction du cout du produit
    this.updateAffichagePrix();
    // update la value en fonction du multiplier
    this.onChangeValueMultiplier();
  }

  /**
   * Méthode pour calculer le maximum de produit qu'on peut acheter
   */
  calcMaxCanBuy() {
    let r = this.product.croissance;
    let n = (Math.log(1- ( (this.globalMoney* (1-r) ) / this.product.cout ))) / Math.log(r);
    return n;
  }

  /**
   * Méthode pour calculer le cout du prochain produit
   */
  calcProchainCout(qt: number){
    this.product.cout = this.initialPrice * Math.pow(this.product.croissance,qt);
  }

  /**
   * Méthode qui calcule le prochain revenu
   */
  calcNewRevenu(){
    this.product.revenu = this.initialRevenu * this.product.quantite;
  }

  /**
   * Méthode qui update l'affichage du prix en fonction du cout du produit
   */
  updateAffichagePrix(){
    this.affichagePrix = this.product.cout;
  }

  checkAvailibility(){
    if(this.product.quantite > 0) this.isAvailable = true;
    else this.isAvailable = false;
  }

}
