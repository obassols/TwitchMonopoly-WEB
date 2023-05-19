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

  getGame() {
    return this.socket.emit('getGame');
  }

  sendAction(action: any) {
    return this.socket.emit('action', action);
  }

  startGame() {
    return this.socket.emit('startGame');
  }

  resetGame() {
    return this.socket.emit('resetGame');
  }

  kickPlayer(player: string) {
    return this.socket.emit('kickPlayer', player);
  }
}
