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
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDivider, MatDividerModule} from "@angular/material/divider";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { BigvaluePipe } from './bigvalue.pipe';
import {MatRippleModule} from "@angular/material/core";
import { MsFormatPipe } from './ms-format.pipe';
import {ManagersComponent} from "./managers/managers.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatBadgeModule} from "@angular/material/badge";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatLabel} from "@angular/material/form-field";

const appRoutes: Routes = [
  { path: '', component: GameplayComponent},
  { path: 'gameplay', component: GameplayComponent },
  { path: 'achievements', component: AchievementsComponent },
  { path: 'managers', component: ManagersComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GameplayComponent,
    AchievementsComponent,
    ProductComponent,
    BigvaluePipe,
    MsFormatPipe,
    ManagersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    MatGridListModule,
    MatProgressBarModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatSnackBarModule,
    MatBadgeModule,
    FormsModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
