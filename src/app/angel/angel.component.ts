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

  constructor(private service: RestServiceService, private snackBar: MatSnackBar) {
    this.server = service.getServer();
    service.getWorld().then(
      world => {
        this.world = world;
      });
  }

  ngOnInit(): void {
  }

  popMessage(message:string):void
  {
    this.snackBar.open(message,"",{duration:2000})
  }

  claimAnges() {
    this.popMessage("Vous avez récupéré "+this.world.activeangels+" anges");
  }
}
