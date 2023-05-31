import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { ReportInvoiceVsCollection, SearchReportInvoiceVsCollection } from 'app/models/Reports';
import { MatSelect, PageEvent } from '@angular/material';
import { ReportsService } from 'app/services/report.service';
import { Globals } from 'app/services/globalfile';
import { takeUntil, take } from 'rxjs/operators';
interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-report-invoice-vs-collectionreport',
  templateUrl: './report-invoice-vs-collectionreport.component.html',
  styleUrls: ['./report-invoice-vs-collectionreport.component.scss']
})
export class ReportInvoiceVsCollectionreportComponent implements OnInit {

  public ProjectNameCtrl: FormControl = new FormControl();
  public ProjectNameFilterCtrl: FormControl = new FormControl();
  public ClientNameCtrl: FormControl = new FormControl();
  public ClientNameFilterCtrl: FormControl = new FormControl();

  public FromDate: FormControl = new FormControl();
  public ToDate: FormControl = new FormControl();

  public selected = "10"
  excel = []
  projectName: DropDown[]
  clientName: DropDown[]

  DetailActive = "false"
  public filteredProjects: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredClients: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);


  pageEvent: PageEvent

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  private _onDestroy = new Subject<void>();
  searchTerm$ = new Subject<string>();
  IVCReport: ReportInvoiceVsCollection[];
  col = [];
  len: number
  status = ''
  pageSize: number = 10;
  RoleName = ''

  StartDate: FormControl = new FormControl();
  Todate: FormControl = new FormControl();
  pageSizeCtrl: FormControl = new FormControl();
  constructor(private _reportService: ReportsService, private globals: Globals) { }
  searchIVCReport = new SearchReportInvoiceVsCollection();
  ngOnInit() {
    this.RoleName = this.globals.RoleName()
    this._reportService.refreshNeeded$
      .subscribe(() => {
        this.getInvoiceVsCollectionList();
      });
    this.getInvoiceVsCollectionList();

    this._reportService.getProjectName().subscribe(res => {
      this.projectName = res.data;

      this.filteredProjects.next(this.projectName.slice());
    });

    this._reportService.getClientName().subscribe(res => {
      this.clientName = res.data;

      this.filteredClients.next(this.clientName.slice());
    });

    this.ProjectNameFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProjects();
      });

    this.ClientNameFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClients();
      });


  }
  GetClientProject() {
    this._reportService.getClientProject(this.ClientNameCtrl.value)
      .subscribe(res => {
        this.projectName = res.data;
        this.filteredProjects.next(this.projectName.slice());
      }, error => { console.log(error) });
    this.SearchIVCReport()
  }
  private getInvoiceVsCollectionList() {
    this.status = "Loading...."
    this._reportService.getInvoiceVsCollectionReport().subscribe(res => {
      this.IVCReport = res.data;
      this.col = res.data;
      if (this.IVCReport == null) {
        this.status = "No Record Found"
      }

    });

  }

  ngAfterViewInit() { this.SetInitialValue(); }
  ngOnDestroy() { this._onDestroy.next(); this._onDestroy.complete(); }


  private SetInitialValue() {
    this.filteredProjects
      .pipe(take(0), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
      });
  }
  //Filter Project START
  private filterProjects() {
    if (!this.projectName) {
      return;
    }
    let search = this.ProjectNameFilterCtrl.value;
    if (!search) {
      this.filteredProjects.next(this.projectName.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredProjects.next(
      this.projectName.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }
  //Filter Project END

  //Filter Client START
  private filterClients() {
    if (!this.clientName) {
      return;
    }
    let search = this.ClientNameFilterCtrl.value;
    if (!search) {
      this.filteredClients.next(this.clientName.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(
      this.clientName.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }


  //Filter Project END


  //Search  START
  SearchIVCReport() {

    if (this.ProjectNameCtrl.value !== null) {
      this.searchIVCReport.projectId = this.ProjectNameCtrl.value
    }
    if (this.ClientNameCtrl.value !== null) {
      this.searchIVCReport.clientId = this.ClientNameCtrl.value
    }

    if (this.StartDate.value !== null) {
      this.searchIVCReport.fromDate = new Date(this.StartDate.value).toLocaleDateString();
    }
    if (this.Todate.value !== null) {
      this.searchIVCReport.toDate = new Date(this.Todate.value).toLocaleDateString();
    }
    this.searchIVCReport.pageSize = 0;
    this.searchIVCReport.page = 0;
    if (this.StartDate.value !== null || this.ToDate.value !== null) {
      this.DetailActive = "true"
    }
    else {
      this.DetailActive = "false"
    }
    this._reportService.SearchInvoiceVsCollectionReport(this.searchTerm$, this.searchIVCReport)
      .subscribe(res => {
        this.IVCReport = res.data;
        if (this.IVCReport == null) {
          this.status = "No Record Found"
        }
      }, error => { console.log(error) });
  }
  //Search  END



  //Pagination START
  pageSizeDD() {

    this.pageSize = this.pageSizeCtrl.value;
  }
  //Pagination END
  ExportAsPdf() {
    this.excel = [];
    this.IVCReport.forEach(row => {
      this.excel.push({
        'Invoice Name': row.invoiceTitle, 'Client': row.clientName,
        'Project': row.projectName, 'Invoice Amount': row.invoiceAmount,
        'Currency Name': row.currencyName, 'Payment Method': row.paymentMethod,
        // 'Start Date': row.inv,'End Date': row.EndDate
        // ,'Status': row.StatusName
      });
    });
    this._reportService.exportAsExcelFile(this.excel, 'Invoice Vs Collection Report');
  }

  //sortData START
  nameCss: any
  clientNameCss: any
  projectNameCss: any
  hourCss: any
  statusCss: any
  invoiceAmountCss: any
  invoiceDateCss: any
  currencyNameCss: any
  startDateCss: any
  endDateCss: any
  modifiedDateCss: any


  cleanCssClass() {
    this.nameCss = '';
    this.clientNameCss = '';
    this.projectNameCss = '';
    this.hourCss = '';
    this.invoiceAmountCss = '';
    this.invoiceDateCss = '';
    this.currencyNameCss = '';
    this.startDateCss = '';
    this.endDateCss = '';
    this.modifiedDateCss = '';
    this.statusCss = '';
  }


  sort(sortBy: any) {
    this.cleanCssClass();
    let str = this.searchIVCReport.columnName
    if (str !== sortBy) {
      this.searchIVCReport.order = 'DESC'
      this.searchIVCReport.columnName = sortBy;
      this.searchIVCReport.order = this.searchIVCReport.order == 'ASC' ? 'DESC' : 'ASC';
    }
    else {
      this.searchIVCReport.columnName = sortBy;
      this.searchIVCReport.order = this.searchIVCReport.order == 'ASC' ? 'DESC' : 'ASC';
    }
    switch (sortBy) {
      case "Name": this.nameCss = this.searchIVCReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "ClientName": this.clientNameCss = this.searchIVCReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "ProjectName": this.projectNameCss = this.searchIVCReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "Hour": this.hourCss = this.searchIVCReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "InvoiceAmount": this.invoiceAmountCss = this.searchIVCReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "invoiceDate": this.invoiceDateCss = this.searchIVCReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "Status": this.statusCss = this.searchIVCReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "CurrencyName": this.currencyNameCss = this.searchIVCReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "StartDate": this.startDateCss = this.searchIVCReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "EndDate": this.endDateCss = this.searchIVCReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "ModifiedDate": this.modifiedDateCss = this.searchIVCReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;

      default: break;
    }
    this._reportService.SearchIVSR(this.searchIVCReport)
      .subscribe(res => {
        this.IVCReport = res.data;
      });
  }

  //sortData END




  // Reset Filter START

  reset() {
    this.StartDate.reset();
    this.Todate.reset();
    this.searchIVCReport.fromDate = ''
    this.searchIVCReport.toDate = ''
    this.ProjectNameCtrl.reset();
    this.ProjectNameCtrl.setValue(0);
    this.searchIVCReport.projectId = 0
    this.DetailActive = "false"
    this.ClientNameCtrl.reset();
    this.ClientNameCtrl.setValue(0);
    this.searchIVCReport.clientId = 0

    this._reportService.refreshNeeded$
      .subscribe(() => {
        this.getInvoiceVsCollectionList();
      });
    this.getInvoiceVsCollectionList();

  }
}
