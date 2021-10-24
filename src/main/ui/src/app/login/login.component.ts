import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StatsService, Token} from "../stats.service";
import {HttpErrorResponse} from "@angular/common/http";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formBuilder: FormBuilder;
  _statsService: StatsService;
  failedLogin: boolean;

  constructor(formBuilder: FormBuilder, statsService: StatsService, private router: Router) {
    this.formBuilder = formBuilder;
    this._statsService = statsService;
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
    this.failedLogin = false;
  }

  ngOnInit(): void {
  }

  async submit() {
    if (!this.loginForm.valid) {
      return;
    }

    var resp = await this._statsService.getToken({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }).subscribe(
        (data: Token) =>  {
          Cookie.set("token", data.token.toString(), 1);
          this.router.navigate(['adminstats']);
        },
        (error: HttpErrorResponse) => this.failedLogin = true
    );
  }

}
