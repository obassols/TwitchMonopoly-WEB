import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  serverUrl = 'http://localhost:4000';

  private createHeader() {
    const header = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Control-Allow-Headers': 'Origin,Content-Type,Accept,Authorization',
    }
    return { headers: new HttpHeaders(header) }
  }

  getAllSquares() {
    return this.http.get(`${this.serverUrl}/square`, this.createHeader());
  }

  getAllGameSquares(gameId: number) {
    return this.http.get(`${this.serverUrl}/square/game/${gameId}`, this.createHeader());
  }

  getRents(squareId: number) {
    return this.http.get(`${this.serverUrl}/square/${squareId}/rent`, this.createHeader());
  }

  getCard(type: string) {
    return this.http.get(`${this.serverUrl}/card/random/${type}`, this.createHeader());
  }
  
}
