import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StatsService, Token} from "../stats.service";
import {HttpErrorResponse} from "@angular/common/http";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formBuilder: FormBuilder;
  _statsService: StatsService;
  _authService: AuthService;
  failedLogin: boolean;

  constructor(formBuilder: FormBuilder, statsService: StatsService, authService: AuthService, private router: Router) {
    this.formBuilder = formBuilder;
    this._statsService = statsService;
    this._authService = authService;
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
    this.failedLogin = false;
  }

  ngOnInit(): void {
    if(this._authService.isLoggedIn()) {
      this.router.navigate(['home']);
    }
  }

  async submit() {
    if (!this.loginForm.valid) {
      return;
    }

    this._authService.login(this.loginForm.value.username,
      this.loginForm.value.password).then(success => {
      if(this._authService.isLoggedIn()) {
        this.router.navigate(['home']);
      }
      else {
        this.failedLogin = true;
      }
    })

  }

}
