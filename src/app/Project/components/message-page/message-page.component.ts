import { Component } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrls: ['./message-page.component.scss']
})
export class MessagePageComponent {

  game: any;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.getGame();
    this.socketService.game.subscribe((game) => {
      this.game = game;
    });
  }
}
