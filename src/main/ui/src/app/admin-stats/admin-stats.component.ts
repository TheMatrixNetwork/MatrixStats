import { Component, OnInit } from '@angular/core';
import {PlayerStats, StatsService} from "../stats.service";
import {ColorHelper, ScaleType} from "@swimlane/ngx-charts";
import {Cookie} from "ng2-cookies";
import {Router} from "@angular/router";

@Component({
  selector: 'ngx-line-chart',
  template: `
    <ngx-charts-line-chart
      [view]="view"
      [scheme]="colorScheme"
      [legend]="legend"
      [showXAxisLabel]="showXAxisLabel"
      [showYAxisLabel]="showYAxisLabel"
      [xAxis]="xAxis"
      [yAxis]="yAxis"
      [xAxisLabel]="xAxisLabel"
      [yAxisLabel]="yAxisLabel"
      [timeline]="timeline"
      [results]="multi"
      (select)="onSelect($event)"
      (activate)="onActivate($event)"
      (deactivate)="onDeactivate($event)"
      [xAxisTickFormatting]="dateTickFormatting"
      [yAxisTickFormatting]="yAxisFormat"
    >
    </ngx-charts-line-chart>
  `,
})

export class AdminStatsComponent implements OnInit {
  multi: any[];
  view: [number, number] = [1000, 700];
  statsService : StatsService;

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Currency';
  timeline: boolean = true;
  token: String;

  colorScheme = 'cool';

  constructor(statsService: StatsService, private router: Router) {
    this.statsService = statsService;
    this.token = Cookie.get("token");
    if(this.token == '') {
      this.router.navigate(['login']);
    }
      this.multi = [];
    Object.assign(this, this.multi);
    this.setData();
  }

  async setData():Promise<any[]> {
    var pStats = await this.statsService.getPlayerStats("S1mple133").toPromise();
    var series: { value: number; name: Date; }[] = [];

    console.log(pStats);

    pStats.stats.forEach(stat => series.push({
      value: stat.money,
      name: new Date(stat.timestamp)
    }));

    var s1mple133 = {
      name: "S1mple133",
      series: series
    }

    console.log(s1mple133);

    this.multi = [s1mple133];
    this.multi = [...this.multi];

    return this.multi;
  }

  yAxisFormat(val: any) {
    return '$ ' + val.toLocaleString();
  }

  dateTickFormatting(val: any): string {
    return (<Date>val).toLocaleString('en-US', {month: "numeric", day: "numeric", hour: "numeric", minute:"numeric"});
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(): void {
  }
}
