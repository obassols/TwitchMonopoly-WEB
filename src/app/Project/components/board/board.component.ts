import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

    basePlayers = [
        {
            id: 1,
            name: 'Waiting...',
            position: 1,
            money: -1,
            properties: [],
            cards: [],
            baseBottom: 4,
            baseRight: 4,
            bottom: 4,
            right: 4,
            jail: false,
        },
        {
            id: 2,
            name: 'Waiting...',
            position: 1,
            money: -1,
            properties: [],
            cards: [],
            baseBottom: 4,
            baseRight: 1,
            bottom: 4,
            right: 1,
            jail: false,
        },
        {
            id: 3,
            name: 'Waiting...',
            position: 1,
            money: -1,
            properties: [],
            cards: [],
            baseBottom: 1,
            baseRight: 4,
            bottom: 1,
            right: 4,
            jail: false,
        },
        {
            id: 4,
            name: 'Waiting...',
            position: 1,
            money: -1,
            properties: [],
            cards: [],
            baseBottom: 1,
            baseRight: 1,
            bottom: 1,
            right: 1,
            jail: false,
        },
    ];
    game = {
        id: 1,
        taxes: 0,
        turn: 1,
        squares: Array<any>(),
        players: Array<any>(),
        dice: Array<number>(),
        actions: Array<any>(),
        actualPlayer: 0,
        actualSquare: undefined,
        actualCard: undefined,
        playing: false,
    };

    rows = Array<any>();
    displayDice: boolean = false;
    displaySquare: boolean = false;
    squareTimeout: any;

    constructor(private socketService: SocketService) { }

    ngOnInit() {
        this.game.players = this.basePlayers;
        this.socketService.getGame();
        this.socketService.game.subscribe((game: any) => {
            this.game = game;
            this.calcDisplaySquare(this.game.actualSquare);
            this.calcCoordsAll();
            console.log(this.game);
            if (this.game.squares.length > 0) {
                this.calcRows();
            }
            if (this.game.actions.includes('roll')) {
                this.displayDice = false;
            } else {
                this.displayDice = true;
            }
        });
    }

    calcRows() {
        this.rows[0] = this.game.squares.filter((square: any) => square.id < 11);
        this.rows[1] = this.game.squares.filter((square: any) => square.id > 10 && square.id < 21);
        this.rows[2] = this.game.squares.filter((square: any) => square.id > 20 && square.id < 31);
        this.rows[2][0].money = this.game.taxes;
        this.rows[3] = this.game.squares.filter((square: any) => square.id > 30 && square.id < 41);
    }

    calcCoordsAll() {
        this.game.players.forEach((player: any) => {
            this.calcCoords(player);
        });
    }

    calcCoords(player: any) {
        if (player.position == 1) {
            player.bottom = player.baseBottom;
            player.right = player.baseRight;
        } else if (player.position < 11) {
            player.bottom = player.baseBottom;
            player.right = player.baseRight + (player.position - 2) * 7.5 + 11.25;
        } else if (player.position == 11) {
            if (player.jail) {
                player.bottom = player.baseBottom + 3;
                player.right = player.baseRight + 79;
            } else {
                if (player.baseBottom == 4 && player.baseRight == 4) {
                    player.bottom = 6;
                    player.right = 87.2;
                } else if (player.baseBottom == 4 && player.baseRight == 1) {
                    player.bottom = 3;
                    player.right = 87.2;
                } else if (player.baseBottom == 1 && player.baseRight == 4) {
                    player.bottom = 0.2;
                    player.right = 83;
                } else if (player.baseBottom == 1 && player.baseRight == 1) {
                    player.bottom = 0.2;
                    player.right = 80;
                }
            }
        } else if (player.position < 21) {
            player.bottom = player.baseBottom + (player.position - 12) * 7.5 + 11.25;
            player.right = 87.2 - player.baseRight;
        } else if (player.position < 31) {
            player.bottom = 87.2 - player.baseBottom;
            player.right = 87.2 - (player.baseRight + (player.position - 22) * 7.5 + 11.25);
        } else {
            player.bottom = 87.2 - (player.baseBottom + (player.position - 32) * 7.5 + 11.25);
            player.right = player.baseRight;
        }
        return player;
    }

    findPlayer(id: number) {
        return this.game.players.find((player: any) => player.id == id);
    }

    isActivePlayer(id: number) {
        return this.game.players[this.game.actualPlayer].id == id;
    }

    calcDisplaySquare(square: any) {
        if (!square) {
            this.displaySquare = false;
            if (this.squareTimeout) clearTimeout(this.squareTimeout);
            return;
        }
        if (square.type !== 'go'
            && square.type !== 'jail'
            && square.type !== 'free_parking'
            && square.type !== 'go_to_jail') {
            if (this.squareTimeout) clearTimeout(this.squareTimeout);
            this.squareTimeout = setTimeout(() => {
                this.displaySquare = true;
            }, 3000);
        } else {
            this.displaySquare = false;
        }

    }
}
