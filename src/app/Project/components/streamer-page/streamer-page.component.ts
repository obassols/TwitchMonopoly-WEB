import { Component } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-streamer-page',
  templateUrl: './streamer-page.component.html',
  styleUrls: ['./streamer-page.component.scss']
})
export class StreamerPageComponent {

  game: any;
  streamer: any;
  selectedPlayer: any;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.game = {};
    this.game.players = [];
    this.socketService.getGame()
    this.socketService.game.subscribe((game: any) => {
      this.game = game;
      this.streamer = this.game.players.find((player: any) => player.role === 'streamer');
      console.log(this.game);
    });
  }

  startGame() {
    this.socketService.startGame()
  }

  reset() {
    this.socketService.resetGame()
  }

  kickPlayer(player: any) {
    this.socketService.kickPlayer(player)
  }

  actionAllowed(action: string) {
    if (this.game.actions) {
      return this.game.actions.includes(action);
    } else {
      return false;
    }
  }

  sendAction(actionName: string) {
    console.log(actionName);
    const action = {
      player: this.streamer.name,
      action: actionName
    }
    console.log(action);
    this.socketService.sendAction(action);
  }

  /* calcPosition(player: any, dice: number) {
    if (!this.game.playing) return;
    player.position += dice;
    if (player.position > 40) {
      player.position -= 40;
      player.money += 200;
    }
    // this.calcCoords(player);
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
      let square = this.game.squares.find((square: any) => square.id == player.position);
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
      }, 2000);
      this.calcActions(player, square);
    } else if (card.action === 'ADVANCE_CONDITIONAL') {
      setTimeout(() => {
        this.calcPosition(player, card.amount);
      }, 2000);

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
      this.calcCoords(player);
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
 */
}