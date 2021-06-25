import { Component, OnInit } from '@angular/core';
import {Pallier, World} from "../world";
import {RestServiceService} from "../services/rest-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-angel',
  templateUrl: './angel.component.html',
  styleUrls: ['./angel.component.scss']
})
export class AngelComponent implements OnInit {

  world: World = new World();
  server: string;
  angel : Pallier;
  totalAngels: number = 0;
  currentAngels: number = 0;

  constructor(private service: RestServiceService,
              private snackBar: MatSnackBar) {
    this.server = service.getServer();
    service.getWorld().then(
      world => {
        this.world = world;
        this.totalAngels = this.world.activeangels;
        this.calculAnge();
      });
  }

  ngOnInit(): void {
  }

  popMessage(message:string):void
  {
    this.snackBar.open(message,"",{duration:2000})
  }

  claimAnges() {
    this.playAudio();
    this.popMessage("Vous avez récupéré "+this.currentAngels.toFixed(0)+" anges");
    this.totalAngels += this.currentAngels;
    this.currentAngels = 0;
    this.service.putAngel(this.totalAngels);
    this.service.deleteWorld();
  }

  calculAnge(){
    this.currentAngels = (150 * Math.sqrt((this.world.score)/Math.pow(10,15))-this.totalAngels);
  }

  playAudio(){
    let audio = new Audio();
    audio.src = "../../assets/cHonteux.mp3";
    audio.load();
    audio.play();
  }


}
