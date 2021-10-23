import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StatsService} from "../stats.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formBuilder: FormBuilder;
  _statsService: StatsService;

  constructor(formBuilder: FormBuilder, statsService: StatsService) {
    this.formBuilder = formBuilder;
    this._statsService = statsService;
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }

    console.log(this._statsService.getToken({username: this.loginForm.value.username, password: this.loginForm.value.password}));
    console.log(this.loginForm.value);
  }

}
