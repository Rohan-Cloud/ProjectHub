import { Component, OnInit } from '@angular/core';
import { Dashboard_TotalRevenue } from 'app/models/dashboard';
import { DashboardService } from 'app/services/dashboardservice.service';
import { ReportsService } from 'app/services/report.service';

@Component({
  selector: 'app-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.scss']
})
export class ReportDashboardComponent implements OnInit {
  amount = 0
  b2camount = 0
  chartConfig: Object;
  dataSource: Object;
  data: any
  constructor(private _dashboardService: DashboardService, private _reportService: ReportsService) { }
  dashboard_TotalRevenue = new Dashboard_TotalRevenue()
  ngOnInit() {

    this._dashboardService.getB2C().subscribe(res => {
      this.data = res.data
      this.getB2C(this.data);
    });
    this._dashboardService.searchEntries(this.dashboard_TotalRevenue).subscribe(res => {
      res.data.forEach(element => { this.amount = this.amount + element['value']; });;
    });

    this._reportService.getBusinessFromClientReport().subscribe(res => {
      res.data.forEach(element => { this.b2camount = this.b2camount + element['projectValue']; });;
    });

  }
  getB2C(data: any) {
    this.chartConfig = {
      width: '415',
      height: '300',
      type: 'column2d',
      dataFormat: 'json',
    };

    this.dataSource = {
      "chart": {
        "caption": "Buisness From Client",
        "palettecolors": "5d62b5,29c3be,f2726f",
        "subCaption": "In Doller=Client",
        "xAxisName": "Client-Project",
        "showBorder": "1",
        "yAxisName": "Project Value",
        "numberSuffix": "$",
        "theme": "fusion",
      },

      "data": data
    };


  }
}
