import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {AuthService} from "../auth.service";
import {StatsService} from "../stats.service";
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";

declare const genSkin: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})

export class HomeComponent implements OnInit {

  constructor(private _authService: AuthService,
              private _statsService: StatsService,
              private router: Router) { }


  ngOnInit(): void {
    if(!this._authService.isLoggedIn()) {
      this.router.navigate(['login']);
    }

    this._statsService.getSkinName().subscribe((skin: any) => {
      console.log(skin.skin);

      genSkin(skin.skin);
    });
  }

}
