import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-big-square',
  templateUrl: './big-square.component.html',
  styleUrls: ['./big-square.component.scss']
})
export class BigSquareComponent {
  @Input() square: any;
  @Input() card: any;

  constructor(private apiService: ApiService) { }

  ngOnChanges(): void {
    if (this.square.type === 'supply' || this.square.type === 'station' || this.square.type === 'property') {
      this.getRents(this.square);
    }
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

  getRents(square: any): void {
    this.apiService.getRents(square.id).subscribe((res: any) => {
      square.rents = res;
      console.log(res);
    });
  }
}
