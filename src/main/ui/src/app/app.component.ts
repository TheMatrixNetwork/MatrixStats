import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Matrix Stats';
  currencyData: any;

  ngOnInit() {
    window.console.log = function () { };
  }
}
