import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from "@angular/material/sidenav";
import { HeaderComponent } from './header/header.component';
import { GameplayComponent } from './gameplay/gameplay.component';
import { AchievementsComponent } from './achievements/achievements.component';
import {RouterModule, Routes} from "@angular/router";
import { ProductComponent } from './product/product.component';
import {HttpClientModule} from "@angular/common/http";
import {MatGridListModule} from "@angular/material/grid-list";

const appRoutes: Routes = [
  { path: 'gameplay', component: GameplayComponent },
  { path: 'achievements', component: AchievementsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GameplayComponent,
    AchievementsComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
