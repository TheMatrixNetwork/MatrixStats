import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {AuthService} from "./auth.service";

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
  constructor(private http: HttpClient, private _authService: AuthService) { }

  public getPlayerStats(playerName: string): Observable<MatrixPlayer> {
    //return this.http.get<PlayerStats>(`http://localhost:8080/api/stats/${playerName}`);
    return this.http.get<MatrixPlayer>(`https://api.matrixnetwork.org/api/stats/${playerName}`);
  }

  public getSkinName(): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':  this._authService.getToken(),
      })
    };

    return this.http.get<any>(`https://api.matrixnetwork.org/api/skin/`, httpOptions);
  }
}
