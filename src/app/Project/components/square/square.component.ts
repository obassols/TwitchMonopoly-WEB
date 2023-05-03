import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() square: any;
  
  constructor() { }

  ngOnInit(): void {
    console.log(this.square);
  }

  getImgSrc(square: any): string {
    if (square.type === 'chance') {
      return 'assets/chance.png';
    } else if (square.type === 'community_chest') {
      return 'assets/community_chest.png';
    } else if (square.type === 'go') {
      return 'assets/go.png';
    } else if (square.type === 'go_to_jail') {
      return 'assets/go_to_jail.png';
    } else if (square.type === 'jail') {
      return 'assets/jail.png';
    } else if (square.type === 'free_parking') {
      return 'assets/parking.png';
    } else if (square.type === 'station') {
      return 'assets/station.png';
    } else if (square.type === 'supplies') {
      if (square.shortName === 'EC') {
        return 'assets/electric.png';
      } else if (square.shortName === 'WC') {
        return 'assets/water.png';
      }
    }
    return '';
  }
}
