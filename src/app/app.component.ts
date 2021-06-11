import { Component } from '@angular/core';
import { RestServiceService } from './services/rest-service.service';
import { World, Product, Pallier } from './world';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  world: World = new World();
  server: string;

  constructor(private service: RestServiceService) {
    this.server = service.getServer();
    service.getWorld().then(
      world => {
        this.world = world;
      });
  }


}
