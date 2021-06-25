import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Pallier, Product} from "../world";
import {RestServiceService} from "../services/rest-service.service";
import {Subscription} from "rxjs";
import {GlobalMoneyServiceService} from "../services/global-money-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AchievementsService} from "../services/achievements.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  product: Product;
  progressbarValue: number;
  lastUpdate: number;
  server: string;
  globalMoneySubscription: Subscription;
  globalMoney: number;
  inFabrication: boolean = false;
  _currentMulti: string;
  buyable: boolean = false;
  initialPrice: number;
  visibilityBadge: boolean = false;
  maxQtt: number = 0;
  qttToBuy: number = 1;
  isAvailable = false;
  unlock: Pallier;
  affichagePrix2: number;
  affichageRevenu: number;
  showVitesse: boolean = true;
  interval;
  achievementsSubscription: Subscription;

  @Input()
  set currentMulti(value: string) {
    this._currentMulti = value;
    this.onChangeValueMultiplier();
  }

  @Input()
  set produit(value: Product) {
    this.product = value;
    this.initialPrice = this.product.cout;
    this.affichagePrix2 = this.product.cout;
    if (this.product.quantite > 1) this.affichagePrix2 = this.product.cout * Math.pow(this.product.croissance, this.product.quantite - 1);

    console.log("@@@"+this.product.revenu + " "+this.product.quantite);
    if (this.product.quantite > 1) this.affichageRevenu = this.product.revenu * this.product.quantite;
    else this.affichageRevenu = this.product.revenu;
  }

  constructor(private service: RestServiceService,
              private globalMoneyService: GlobalMoneyServiceService,
              private snackBar: MatSnackBar,
              private achievementsService: AchievementsService) {
    this.server = service.getServer();
  }

  /**
   * Executée a la fermeture du component
   * Ici très important, puisque permet de clear les intervalles existants
   * et donc de ne pas en recréer à l'init, ce qui dupliquerait les intervalles, et
   * rendrait le calcul du score completement incohérent
   */
  ngOnDestroy(): void {
    clearInterval(this.interval);
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
    this.interval = setInterval(
      () => {
        this.calcScore();
      }, 100
    );

    this.checkAvailibility();

    if (this.product.managerUnlocked) {
      this.startFabrication();
    }

  }

  /**
   * Méthode qui lance la fabrication
   */
  startFabrication() {
    if (!this.inFabrication && this.product.quantite > 0) {
      this.product.timeleft = this.product.vitesse;
      this.lastUpdate = Date.now();
      this.inFabrication = true;
      this.showVitesse = false;
      console.log("RE : " + this.product.revenu + " " + this.affichageRevenu);
      this.service.putProduct(this.product);
    }
  }

  /**
   * Méthode qui calcule le score du produit en cours de fabrication
   */
  calcScore() {
    if (this.product.timeleft !== 0 || (this.product.managerUnlocked && this.product.quantite > 0)) {
      this.showVitesse = false;
      let currentTime = Date.now();
      this.product.timeleft -= currentTime - this.lastUpdate;
      this.lastUpdate = currentTime;
      if (this.product.timeleft <= 0) { // fabrication finie
        if (this.product.managerUnlocked) this.product.timeleft = this.product.vitesse;
        else this.product.timeleft = 0;
        this.progressbarValue = 0;
        this.inFabrication = false;
        this.showVitesse = true;
        this.globalMoney += this.affichageRevenu;
        this.globalMoneyService.setGlobalMoney(this.globalMoney);
        this.globalMoneyService.emitGlobalMoneySubject();
      } else { // sinon update progressbar
        this.progressbarValue = ((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100;
      }
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
        this.affichagePrix2 = this.product.cout * Math.pow(this.product.croissance, this.product.quantite - 1);
        this.qttToBuy = 1;
        break;

      case "x10":
        this.affichagePrix2 = (((this.product.cout * Math.pow(this.product.croissance, this.product.quantite - 1)) * (1 - Math.pow(r, 10))) / (1 - r));
        this.qttToBuy = 10;
        break;

      case "x100":
        this.affichagePrix2 = (((this.product.cout * Math.pow(this.product.croissance, this.product.quantite - 1)) * (1 - Math.pow(r, 100))) / (1 - r));
        this.qttToBuy = 100;
        break;

      case "Max":
        this.maxQtt = Math.trunc(this.calcMaxCanBuy());
        if (this.maxQtt > 0) {
          this.visibilityBadge = true;
          this.affichagePrix2 = (((this.product.cout * Math.pow(this.product.croissance, this.product.quantite - 1)) * (1 - Math.pow(r, this.maxQtt))) / (1 - r));
          this.qttToBuy = this.maxQtt;
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
    if (this.affichagePrix2 <= this.globalMoney) this.buyable = true;
    else this.buyable = false;
  }

  /**
   * Méthode qui s'execute lorsqu'on achete un produit
   */
  onBuy() {
    // update de l'argent du joueur
    this.globalMoneyService.setGlobalMoney(this.globalMoney - this.affichagePrix2);
    this.globalMoneyService.emitGlobalMoneySubject();
    // si on achete plusieurs produit en meme temps, alors passer la quantité avant le calcul du nouveau cout
    if (this.qttToBuy > 1) {
      this.product.quantite += this.qttToBuy;
      this.calcProchainCout(this.product.quantite - 1);
      this.achievementsService.getFirstAchievement(this.product.id, this.product.quantite);
    } else { // sinon passer la quantité apres le calcul du nouveau cout
      this.calcProchainCout(this.product.quantite);
      this.product.quantite += this.qttToBuy;
      this.achievementsService.getFirstAchievement(this.product.id, this.product.quantite);
    }
    // si nouveau produit, degrise
    this.checkAvailibility();
    // calcul du nouveau revenu
    this.calcNewRevenu();
    // update la value en fonction du multiplier
    this.onChangeValueMultiplier();
    console.log("RE2 : " + this.product.revenu + " " + this.affichageRevenu);
    this.service.putProduct(this.product);
  }

  popMessage(message: string): void {
    this.snackBar.open(message, "", {duration: 2000})
  }

  /**
   * Méthode pour calculer le maximum de produit qu'on peut acheter
   */
  calcMaxCanBuy() {
    let r = this.product.croissance;
    let n = (Math.log(1 - ((this.globalMoney * (1 - r)) / (this.product.cout * Math.pow(this.product.croissance, this.product.quantite - 1))))) / Math.log(r);
    return n;
  }

  /**
   * Méthode pour calculer le cout du prochain produit
   */
  calcProchainCout(qt: number) {
    this.affichagePrix2 = this.initialPrice * Math.pow(this.product.croissance, qt);
  }

  /**
   * Méthode qui calcule le prochain revenu
   */
  calcNewRevenu() {
    console.log("newCalc"+this.product.revenu + " " +this.product.quantite);
    this.affichageRevenu = this.product.revenu * this.product.quantite;
  }

  checkAvailibility() {
    if (this.product.quantite > 0) this.isAvailable = true;
    else this.isAvailable = false;
  }

  checkUnlocks() { //TODO
    if (this.product.quantite == this.unlock.seuil) {
      console.log("débloqué");
      this.unlock.unlocked = true;
    }
  }

}
