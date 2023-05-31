import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'app/services/report.service';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { Subject } from 'rxjs';
import { FreeSummaryReport, SearchFreeSummaryReport } from 'app/models/Reports';

@Component({
  selector: 'app-reportfreesummaryreport',
  templateUrl: './reportfreesummaryreport.component.html',
  styleUrls: ['./reportfreesummaryreport.component.scss']
})
export class ReportfreesummaryreportComponent implements OnInit {

  public FromDate: FormControl = new FormControl();
  public ToDate: FormControl = new FormControl();
  pageSizeCtrl: FormControl = new FormControl();


  excel = []


  status = ''
  pageEvent: PageEvent


  private _onDestroy = new Subject<void>();
  searchTerm$ = new Subject<string>();

  FreeSummaryList: FreeSummaryReport[]
  SearchFreeSummary = new SearchFreeSummaryReport()
  constructor(private _reportService: ReportsService) { }
  pageSize: number = 10;
  ngOnInit() {
    this._reportService.refreshNeeded$
      .subscribe(() => {
        this.GetFreeSummaryReport();
      });
    this.GetFreeSummaryReport();
  }
  GetFreeSummaryReport() {
    this.status = "Loading...."
    this._reportService.getFreeSummaryReport().subscribe(res => {
      this.FreeSummaryList = res.data;
      if (this.FreeSummaryList == null) {
        this.status = "No Record Found"
      }
    });
  }
  SearchFreeSummaryReport() {

    if (this.FromDate.value !== null) {
      this.SearchFreeSummary.fromDate = new Date(this.FromDate.value).toLocaleDateString();
    }
    if (this.ToDate.value !== null) {
      this.SearchFreeSummary.toDate = new Date(this.ToDate.value).toLocaleDateString();
    }
    this.SearchFreeSummary.PageSize = 0;
    this.SearchFreeSummary.page = 0;
    this._reportService.SearchFreeSummaryReport(this.searchTerm$, this.SearchFreeSummary)
      .subscribe(res => {
        this.FreeSummaryList = res.data;
        if (this.FreeSummaryList == null) {
          this.status = "No Record Found"
        }
      }, error => { console.log(error) });
  }
  NameCss: any
  TitleCss: any
  technologyNameCss: any
  RoleCss: any
  EmailIdCss: any

  cleanCssClass() {
    this.NameCss = '';
    this.TitleCss = '';
    this.technologyNameCss = '';
    this.RoleCss = '';
    this.EmailIdCss = ''

  }
  sort(sortBy: any) {
    this.cleanCssClass();

    let str = this.SearchFreeSummary.columnName
    if (str !== sortBy) {
      this.SearchFreeSummary.order = 'DESC'
      this.SearchFreeSummary.columnName = sortBy;
      this.SearchFreeSummary.order = this.SearchFreeSummary.order == 'ASC' ? 'DESC' : 'ASC';
    }
    else {
      this.SearchFreeSummary.columnName = sortBy;
      this.SearchFreeSummary.order = this.SearchFreeSummary.order == 'ASC' ? 'DESC' : 'ASC';
    }
    switch (sortBy) {
      case "Name": this.NameCss = this.SearchFreeSummary.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "Title": this.TitleCss = this.SearchFreeSummary.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "TechnologyName": this.technologyNameCss = this.SearchFreeSummary.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "RoleName": this.RoleCss = this.SearchFreeSummary.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "EmailId": this.EmailIdCss = this.SearchFreeSummary.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;

      default: break;
    }
    this._reportService.SearchFreeSummaryR(this.SearchFreeSummary)
      .subscribe(res => {
        this.FreeSummaryList = res.data;
      });
  }
  reset() {
    this.FromDate.reset();

    this.ToDate.reset();
    this.SearchFreeSummary.fromDate = ''
    this.SearchFreeSummary.toDate = ''
    this._reportService.refreshNeeded$
      .subscribe(() => {
        this.GetFreeSummaryReport();
      });

    this.GetFreeSummaryReport();
  }
  ExportAsPdf() {
    this.excel = [];
    this.FreeSummaryList.forEach(row => {
      this.excel.push({
        'Employee Name': row.name, 'Title': row.title,
        'Technolgy': row.technologyName, 'Role': row.roleName,
        'EmailId': row.emailId
      });
    });
    this._reportService.exportAsExcelFile(this.excel, 'Free Summary Report');
  }
  pageSizeDD() {

    this.pageSize = this.pageSizeCtrl.value;
  }
}
