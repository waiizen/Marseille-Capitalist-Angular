import {Component, Input, OnInit} from '@angular/core';
import {World} from "../world";
import {Subscription} from "rxjs";
import {GlobalMoneyServiceService} from "../services/global-money-service.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  world: World;

  globalmoney: number;
  gmSubscription: Subscription;

  constructor(private gmService: GlobalMoneyServiceService) { }

  ngOnInit(): void {
    this.gmSubscription = this .gmService.globalMoneySubject.subscribe(
      (globalmoney: number) => {
        this.globalmoney = globalmoney;
      }
    );
    this.gmService.emitGlobalMoneySubject();
  }

}
