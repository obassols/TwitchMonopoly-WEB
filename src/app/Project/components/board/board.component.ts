import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

    constructor(private apiService: ApiService, private socketService: SocketService) { }
    game = {
        id: 1,
        taxes: 0,
        turn: 1,
        squares: Array<any>(),
        players: Array<any>(),
        dice: 0,
        actualPlayer: 0,
        actualSquare: null,
        actualCard: null,
    };

    rows = Array<any>();
    timeoutSquare: any;

    ngOnInit() {
        this.apiService.getAllGameSquares(this.game.id).subscribe((res: any) => {
            this.game.squares = res;
            this.rows[0] = this.game.squares.filter((square: any) => square.id < 11);
            this.rows[1] = this.game.squares.filter((square: any) => square.id > 10 && square.id < 21);
            this.rows[2] = this.game.squares.filter((square: any) => square.id > 20 && square.id < 31);
            this.rows[3] = this.game.squares.filter((square: any) => square.id > 30 && square.id < 41);
        });

        this.game.players = [
            {
                id: 1,
                name: 'Player 1',
                color: 'red',
                position: 1,
                money: 1500,
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
                name: 'Player 2',
                color: 'blue',
                position: 1,
                money: 1500,
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
                name: 'Player 3',
                color: 'green',
                position: 1,
                money: 1500,
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
                name: 'Player 4',
                color: 'yellow',
                position: 1,
                money: 1500,
                properties: [],
                cards: [],
                baseBottom: 1,
                baseRight: 1,
                bottom: 1,
                right: 1,
                jail: false,
            },
        ];
        this.socketService.setGame(this.game);
        this.socketService.getGame();
        this.socketService.game.subscribe((game: any) => {
            this.game = game;
        });
    }

    nextPlayer() {
        if (this.game.actualPlayer < this.game.players.length - 1) {
            this.game.actualPlayer++;
        } else {
            this.game.actualPlayer = 0;
        }
    }

    rollDice() {
        this.game.dice = Math.floor(Math.random() * 6) + 1;
        console.log('Dice: ' + this.game.dice);
        return this.game.dice;
    }

    calcPosition(player: any, dice: number) {
        player.position += dice;
        if (player.position > 40) {
            player.position -= 40;
            player.money += 200;
        }
        this.calcCoords(player);
        const square = this.game.squares.find((square: any) => square.id == player.position);
        if (square.type !== 'go' && square.type !== 'jail' && square.type !== 'free_parking' && square.type !== 'go_to_jail') {
            clearTimeout(this.timeoutSquare);
            this.game.actualSquare = square;
            this.timeoutSquare = setTimeout(() => {
                this.game.actualSquare = null;
                this.socketService.setGame(this.game);
            }, 3000);
        } else {
            this.game.actualSquare = null;
        }
        this.calcActions(player, square);
        return player.position;
    }

    calcPositionAll(dice: number) {
        this.game.players.forEach((player: any) => {
            this.calcPosition(player, dice);
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

    sendToJailAll() {
        this.game.players.forEach((player: any) => {
            this.sendToJail(player);
        });
    }

    sendToJail(player: any) {
        player.jail = true;
        player.position = 11;
        return player;
    }

    buyProperty(player: any) {
        const square = this.game.squares.find((square: any) => square.id === player.position);
        if (square.price < player.money && square.owner === null) {
            square.owner = player.id;
            square.upgrades = this.calcUpgrades(player, square);
            player.money -= square.price;
            this.apiService.getRents(square.id).subscribe((res: any) => {
                square.rents = res;
                player.properties.push(square);
            });
        } else {
            if (square.owner === player.id
                && square.type === 'property'
                && square.upgrades < 5
                && player.money > square.housePrice) {
                const colorProperties = player.properties.filter((property: any) => property.color == square.color);
                const colorSquares = this.game.squares.filter((property: any) => property.color == square.color);
                if (colorProperties.length == colorSquares.length) {
                    square.upgrades++;
                    player.money -= square.housePrice;
                } else {
                    alert('You need to buy all properties of this color to upgrade');
                }
            } else {
                alert('Internal error: You can\'t buy this property');
            }
        }

    }

    calcRent(square: any) {
        if (square.rents.length < 1) {
            console.log('No rents');
            return 0;
        } else {
            const rent = square.rents.find((rent: any) => rent.upgrades == square.upgrades);
            return rent.rent;
        }
    }

    calcUpgrades(player: any, square: any) {
        if (square.type == 'supply') {
            const supplies = player.properties.filter((property: any) => property.type == 'supply');
            supplies.forEach((supply: any) => {
                supply.upgrades = supplies.length + 1;
            });
            square.upgrades = supplies.length + 1;
        } else if (square.type == 'station') {
            const stations = player.properties.filter((property: any) => property.type == 'station');
            square.upgrades = stations.length + 1;
            stations.forEach((station: any) => {
                station.upgrades = stations.length + 1;
            });
            console.log(stations);
        } else {
            square.upgrades = 0;
        }
        return square.upgrades;
    }

    payRent(player: any, square: any) {
        const rent = this.calcRent(square);
        console.log('Rent: -' + rent + ' €');
        const owner = this.game.players.find((player: any) => player.id === square.owner);
        player.money -= rent;
        owner.money += rent;
    }

    calcCard(card: any, player: any) {
        console.log(card);
        this.game.actualCard = card;
        if (card.action === 'PAY') {
            if (card.target === 'PLAYER') {
                this.game.players.forEach((p: any) => {
                    if (p.name !== player.name) {
                        p.money += card.amount;
                        player.money -= card.amount;
                    }
                });
            } else {
                player.money -= card.amount;
                console.log(player);
            }
        } else if (card.action === 'PAY_CONDITIONAL') {
            player.properties.forEach((property: any) => {
                if (property.type === 'property') {
                    if (property.upgrades < 5) {
                        player.money -= card.amountHouse * property.upgrades;
                    } else {
                        player.money -= card.amountHotel;
                    }
                }
            });
        } else if (card.action === 'ADVANCE') {
            if (card.squre > -1 && player.position > card.square) {
                player.money += 200;
            } else if (card.square < 0) {
                card.square = -card.square;
            }
            player.position = card.square;
            this.calcCoords(player);
            const square = this.game.squares.find((square: any) => square.id == player.position);
            setTimeout(() => {
                if (square.type !== 'go' && square.type !== 'jail' && square.type !== 'free_parking' && square.type !== 'go_to_jail') {
                    clearTimeout(this.timeoutSquare);
                    this.game.actualSquare = square;
                    this.timeoutSquare = setTimeout(() => {
                        this.game.actualSquare = null;
                        this.socketService.setGame(this.game);
                    }, 3000);
                } else {
                    this.game.actualSquare = null;
                }
                this.socketService.setGame(this.game);
            }, 1000);
            this.calcActions(player, square);
        } else if (card.action === 'ADVANCE_CONDITIONAL') {
            this.calcPosition(player, card.amount);
        } else if (card.action === 'JAIL') {
            console.log(card.action);
            this.sendToJail(player);
            this.calcCoords(player);
        } else if (card.action === 'FREE_JAIL') {
            player.cards.push(card);
            console.log(player.cards);
        }
        this.socketService.setGame(this.game);
    }

    calcActions(player: any, square: any) {
        if (square.owner && square.owner != null && square.owner != player.id) {
            this.payRent(player, square);
        } else if (square.type == 'tax') {
            player.money -= square.amount;
            this.game.taxes += square.amount;
        } else if (square.type == 'go_to_jail') {
            this.sendToJail(player);
        } else if (square.type == 'free_parking') {
            player.money += this.game.taxes;
            this.game.taxes = 0;
        } else if (square.type == 'community_chest') {
            this.apiService.getCard('COMMUNITY_CHEST').subscribe((res: any) => {
                this.calcCard(res, player);
            });
        } else if (square.type == 'chance') {
            this.apiService.getCard('CHANCE').subscribe((res: any) => {
                this.calcCard(res, player);
            });
        }
        this.socketService.setGame(this.game);
    }
}
