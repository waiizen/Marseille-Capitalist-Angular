import { Component, OnInit } from '@angular/core';
import { World, Product, Pallier } from '../world';
import {RestServiceService} from "../services/rest-service.service";

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.scss']
})
export class GameplayComponent implements OnInit {

  world: World = new World();
  server: string;

  constructor(private service: RestServiceService) {
    this.server = service.getServer();
    service.getWorld().then(
      world => {
        this.world = world;
      });
  }

  ngOnInit(): void {
  }



}
