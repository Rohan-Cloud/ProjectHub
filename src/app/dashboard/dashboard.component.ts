import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Dashboard, Dashboard_TotalRevenue } from 'app/models/dashboard';
import { DashboardService } from 'app/services/dashboardservice.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SharedModule } from 'app/shared/shared.module';
import { adminloginService } from 'app/services/adminlogin.service';
import { Globals } from 'app/services/globalfile';


var $j = jQuery.noConflict();
declare let $: any;

interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']

})



export class DashboardComponent implements OnInit {

  public Companyname1: FormControl = new FormControl();
  totalEmployee: number = 0
  totalClient: number = 0
  totalProject: number = 0
  totalInvoiced: number
  penddingMilestone: number
  penddingMilestoneINR: number
  penddingMilestoneDOL: number
  penddingMilestoneGBP: number
  penddingMilestoneEURO: number
  collectionRecived: number
  invoiceINR: number
  invoiceDOL: number
  invoiceGBP: number
  invoiceEURO: number
  collectionReciveINR: number
  collectionReciveDOL: number
  collectionReciveGBP: number
  collectionReciveEURO: number
  dataSource: Object;
  year = [];
  CurrencyName: DropDown[];
  cy = new Date().getFullYear();
  chartConfig: Object;
  sign = ""
  data: any
  dashboard_TotalRevenue = new Dashboard_TotalRevenue()
  searchTerm$ = new Subject<string>();
  public Year: FormControl = new FormControl();

  public CurrencyId: FormControl = new FormControl();
  constructor(private _adminloginService: adminloginService, private _dashboardService: DashboardService, private sharedModule: SharedModule, private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document, private globals: Globals) {

  }
  dashboard: Dashboard[];
  CompanyName: DropDown[];
  RoleName = ''
  DashboardForm = new FormGroup
    ({

      Companyname: new FormControl('', [Validators.required]),
    });
  ngOnInit() {
    this.DashboardForm.controls['Companyname'].setValue(parseInt(atob(localStorage.getItem('CompanyId'))))
    this.RoleName = this.globals.RoleName()
    this._adminloginService.getEmployeeCompany().subscribe(res => {
      this.CompanyName = res.data;
    });
    this.year = this.sharedModule.YearRange()
    this._dashboardService.getCurrency().subscribe(res => {
      this.CurrencyName = res.data;
      this.CurrencyId.setValue(2);
    });
    this.Year.setValue('' + this.cy + '-' + (this.cy + 1) + '')

    this._dashboardService.searchEntries(this.dashboard_TotalRevenue).subscribe(res => {
      if (res.status != false) {
        this.data = res.data
        this.sign = res.data[0].sign;
        this.getTotalRevenue(this.data, this.sign);
      }
      else {
        this.getTotalRevenue(null, this.sign);
      }

    });

    // /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */
    this._dashboardService.getDashboardItem().subscribe(res => {

      if (res.data != null) {
        this.dashboard = res.data;
        res.data.forEach(element => {
          this.totalClient = element.totalClient
          this.totalEmployee = element.totalEmployee
          this.totalProject = element.totalProject
          this.totalInvoiced = element.invoiced
          this.penddingMilestone = element.pendingMilestones
          this.penddingMilestoneINR = element.pendingMilestonesINR
          this.penddingMilestoneDOL = element.pendingMilestonesDOL
          this.penddingMilestoneGBP = element.pendingMilestonesGBP
          this.penddingMilestoneEURO = element.pendingMilestonesEURO
          this.collectionRecived = element.collectionRecived
          this.invoiceINR = element.invoiceINR
          this.invoiceDOL = element.invoiceDOL
          this.invoiceGBP = element.invoiceGBP
          this.invoiceEURO = element.invoiceEURO
          this.collectionReciveINR = element.collectionReciveINR
          this.collectionReciveDOL = element.collectionReciveDOL
          this.collectionReciveGBP = element.collectionReciveGBP
          this.collectionReciveEURO = element.collectionReciveEURO
        });
      }


    }
    );


  }
  ChangeCompany() {
    localStorage.setItem('CompanyId', btoa(this.DashboardForm.controls['Companyname'].value))
    this.RoleName = this.globals.RoleName()
    this._adminloginService.getEmployeeCompany().subscribe(res => {
      this.CompanyName = res.data;
    });
    this.year = this.sharedModule.YearRange()
    this._dashboardService.getCurrency().subscribe(res => {
      this.CurrencyName = res.data;
      this.CurrencyId.setValue(2);
    });
    this.Year.setValue('' + this.cy + '-' + (this.cy + 1) + '')

    this._dashboardService.searchEntries(this.dashboard_TotalRevenue).subscribe(res => {
      if (res.status != false) {
        this.data = res.data
        this.sign = res.data[0].sign;
        this.getTotalRevenue(this.data, this.sign);
      }
      else {
        this.getTotalRevenue(null, this.sign);
      }

    });

    // /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */
    this._dashboardService.getDashboardItem().subscribe(res => {

      if (res.data != null) {
        this.dashboard = res.data;
        res.data.forEach(element => {
          this.totalClient = element.totalClient
          this.totalEmployee = element.totalEmployee
          this.totalProject = element.totalProject
          this.totalInvoiced = element.invoiced
          this.penddingMilestone = element.pendingMilestones
          this.penddingMilestoneINR = element.pendingMilestonesINR
          this.penddingMilestoneDOL = element.pendingMilestonesDOL
          this.penddingMilestoneGBP = element.pendingMilestonesGBP
          this.penddingMilestoneEURO = element.pendingMilestonesEURO
          this.collectionRecived = element.collectionRecived
          this.invoiceINR = element.invoiceINR
          this.invoiceDOL = element.invoiceDOL
          this.invoiceGBP = element.invoiceGBP
          this.invoiceEURO = element.invoiceEURO
          this.collectionReciveINR = element.collectionReciveINR
          this.collectionReciveDOL = element.collectionReciveDOL
          this.collectionReciveGBP = element.collectionReciveGBP
          this.collectionReciveEURO = element.collectionReciveEURO
        });
      }


    }
    );


  }

  getTotalRevenue(data: any, sign) {
    this.chartConfig = {
      width: '700',
      height: '400',
      type: 'column2d',
      dataFormat: 'json',
    };

    this.dataSource = {
      "chart": {
        "caption": "Total Revenue From Client",
        "subCaption": "In " + sign + "=Client",
        "xAxisName": "Client",
        "showBorder": "1",
        "yAxisName": "Revenue",
        "numberSuffix": sign,
        "theme": "fusion",
      },

      "data": data
    };


  }
  SearchTotalRevenue() {
    if (this.Year.value !== null) {
      var yearstr = this.Year.value.split('-');
      this.dashboard_TotalRevenue.fromDate = yearstr[0]
      this.dashboard_TotalRevenue.toDate = yearstr[1]
    }
    if (this.CurrencyId.value !== null) {
      this.dashboard_TotalRevenue.currencyId = this.CurrencyId.value;
    }
    this._dashboardService.searchRevenue(this.searchTerm$, this.dashboard_TotalRevenue)
      .subscribe(res => {
        this.data = res.data;
        if (this.data.length != 0) {
          this.sign = res.data[0].sign;
        }
        this.getTotalRevenue(this.data, this.sign)

      }, error => { console.log(error) });
  }
  reset() {
    this.Year.reset();
    this.CurrencyId.reset();
    this.dashboard_TotalRevenue.fromDate = ' ';
    this.dashboard_TotalRevenue.toDate = ' ';
    this.dashboard_TotalRevenue.currencyId = 0
    this.Year.setValue('' + this.cy + '-' + (this.cy + 1) + '')
    this.CurrencyId.setValue(2);
    this._dashboardService.searchEntries(this.dashboard_TotalRevenue).subscribe(res => {
      this.data = res.data;
      if (this.data.length != 0) {
        this.sign = res.data[0].sign;
        this.getTotalRevenue(this.data, this.sign)
      }
    });

  }
}