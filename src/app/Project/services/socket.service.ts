import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  players: Observable<any> = this.socket.fromEvent('players');
  game: Observable<any> = this.socket.fromEvent('game');

  constructor(private socket: Socket) { }

  getPlayers() {
    return this.socket.emit('getPlayers');
  }

  getGame() {
    return this.socket.emit('getGame');
  }

  setGame(game: any) {
    return this.socket.emit('setGame', game);
  }
}
