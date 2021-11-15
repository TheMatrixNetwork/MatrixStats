import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {Account, Token} from "./stats.service";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public async login(username: string, password: string): Promise<boolean> {
    return new Promise<boolean>(res => {
      this.postAccount({
        username,
        password
      }).subscribe(
        (data: Token) => {
          Cookie.set("token", data.token.toString(), 1);
          res(true);
        },
        (error:Error) =>  {
          res(false);
        }
      );
    });
  }

  private postAccount(account: Account): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    return this.http.post<Token>(environment.url + `/api/auth`, account, httpOptions);
  }

  public getToken() {
    return Cookie.get("token");
  }

  public isLoggedIn(): boolean {
    let str = Cookie.get("token");
    return str != null;
  }
}
