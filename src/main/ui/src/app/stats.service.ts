import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

export interface Location {
  x: number;
  y: number;
  z: number;
}

export interface MatrixPlayer {
  stats: PlayerStats[];
  username: string;
  uuid: string;
}

export interface Token {
  token: string;
  expiryDate: string;
}

export interface Account {
  username: string;
  password: string;
}

export interface PlayerStats {
  username: string;
  location: Location;
  exp: number;
  food_level: number;
  money: number;
  health: number;
  gamemode: number;
  last_damage_cause: string;
  remaining_air: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private http: HttpClient) { }

  public getPlayerStats(playerName: string): Observable<MatrixPlayer> {
    //return this.http.get<PlayerStats>(`http://localhost:8080/api/stats/${playerName}`);
    return this.http.get<MatrixPlayer>(`http://localhost:8080/api/stats/${playerName}`);
  }

  public getToken(account: Account): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    return this.http.post<Token>(`http://localhost:8080/api/auth`, account, httpOptions);
  }
}
