import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameSurfaceComponent } from './components/game-surface/game-surface.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { GameControllerComponent } from './components/game-controller/game-controller.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    GameSurfaceComponent,
    ErrorMessageComponent,
    GameControllerComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
