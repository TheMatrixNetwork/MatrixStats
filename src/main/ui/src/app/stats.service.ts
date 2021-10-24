import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

export interface Location {
  x: number;
  y: number;
  z: number;
}

export interface CurrencyStatus {
  value: number;
  name: Date;
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
  currency_transactions: CurrencyStatus[];
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private http: HttpClient) { }

  public getPlayerStats(playerName: string): Observable<PlayerStats> {
    //return this.http.get<PlayerStats>(`http://localhost:8080/api/stats/${playerName}`);
    return this.http.get<PlayerStats>(`http://localhost:8080/api/stats/${playerName}`);
    // DATA
    /*
    {
    "location":{ "x": 4, "y":68, "z":146},
    "exp":0,
    "food_level":20,
    "username":"S1mple133"
    "currency_transactions": [
    {"value":200, "name":"2021-10-20T14:11:46"},
    {"value":300, "name":"2021-10-21T14:11:46"},
    {"value":100, "name":"2021-10-22T14:11:46"},
    {"value":400, "name":"2021-10-23T14:11:46"}
    ]
    }
     */
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
