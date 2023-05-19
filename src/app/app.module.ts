import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './Project/components/board/board.component';
import { SquareComponent } from './Project/components/square/square.component';
import { BigSquareComponent } from './Project/components/big-square/big-square.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { StreamerPageComponent } from './Project/components/streamer-page/streamer-page.component';
import { FormsModule } from '@angular/forms';
import { MessagePageComponent } from './Project/components/message-page/message-page.component';
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SquareComponent,
    BigSquareComponent,
    StreamerPageComponent,
    MessagePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
