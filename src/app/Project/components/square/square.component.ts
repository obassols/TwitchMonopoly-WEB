import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() square: any;
  @Input() direction: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }

  getImgSrc(square: any): string {
    const IMAGE_URLS: any = {
      chance: 'assets/chance.png',
      community_chest: 'assets/community_chest.png',
      go: 'assets/go.png',
      go_to_jail: 'assets/go_to_jail.png',
      jail: 'assets/jail.png',
      free_parking: 'assets/parking.png',
      station: 'assets/station.png',
      tax: 'assets/tax.png',
      supply: {
        EC: 'assets/electric.png',
        WW: 'assets/water.png',
      },
    };

    const imageUrl =
      square.type in IMAGE_URLS
        ? typeof IMAGE_URLS[square.type] === 'string'
          ? IMAGE_URLS[square.type]
          : IMAGE_URLS[square.type][square.shortName]
        : undefined;

    return imageUrl ?? 'defaultImageUrl';
  }
}
