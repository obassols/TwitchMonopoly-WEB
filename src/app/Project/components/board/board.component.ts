import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  
    constructor(private apiService: ApiService) { }
    squares = Array<any>();
    rows = Array<any>();

    ngOnInit() {
        this.apiService.getAllSquares().subscribe((res: any) => {
            this.squares = res;
            this.rows[0] = this.squares.filter((square: any) => square.id < 11);
            this.rows[1] = this.squares.filter((square: any) => square.id > 10 && square.id < 21);
            this.rows[2] = this.squares.filter((square: any) => square.id > 20 && square.id < 31);
            this.rows[3] = this.squares.filter((square: any) => square.id > 30 && square.id < 41);
        });
    }
}