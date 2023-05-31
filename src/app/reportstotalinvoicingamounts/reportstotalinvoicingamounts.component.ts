import { Component, Pipe, OnInit, ViewChild } from '@angular/core';
import { ReportsService } from 'app/services/report.service';
import { InvoiceReport, SearchInvoiceReport } from 'app/models/Reports';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect, PageEvent } from '@angular/material';
import { takeUntil, take } from 'rxjs/operators';

interface DropDown {
  id: string;
  name: string;
}

@Component({
  selector: 'app-reportstotalinvoicingamounts',
  templateUrl: './reportstotalinvoicingamounts.component.html',
  styleUrls: ['./reportstotalinvoicingamounts.component.scss']
})
@Pipe({ name: 'titleCase' })
export class ReportstotalinvoicingamountsComponent implements OnInit {

  public ProjectNameCtrl: FormControl = new FormControl();
  public ProjectNameFilterCtrl: FormControl = new FormControl();
  public ClientNameCtrl: FormControl = new FormControl();
  public ClientNameFilterCtrl: FormControl = new FormControl();


  public FromDate: FormControl = new FormControl();
  public ToDate: FormControl = new FormControl();
  pageSizeCtrl: FormControl = new FormControl();

  projectName: DropDown[]
  clientName: DropDown[]
  excel = []
  public filteredProjects: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredClients: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);

  status = ''
  pageEvent: PageEvent

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  private _onDestroy = new Subject<void>();
  searchTerm$ = new Subject<string>();

  invoiceReportList: InvoiceReport[]
  searchInvoiceReport = new SearchInvoiceReport()
  constructor(private _reportService: ReportsService) { }


  pageSize: number = 10;
  ngOnInit() {
    this._reportService.refreshNeeded$
      .subscribe(() => {
        this.getInvoiceReport();
      });
    this.getInvoiceReport();
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
  ngAfterViewInit() { this.SetInitialValue(); }
  ngOnDestroy() { this._onDestroy.next(); this._onDestroy.complete(); }
  private SetInitialValue() {
    this.filteredProjects
      .pipe(take(0), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
      });
  }
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

  clientId: number
  subtotal: number = 0
  getInvoiceReport() {
    this.status = "Loading...."
    this._reportService.getInvoicingReport().subscribe(res => {
      this.invoiceReportList = res.data;
      if (this.invoiceReportList == null) {
        this.status = "No Record Found"
      }
    });
  }
  GetClientProject() {
    this._reportService.getClientProject(this.ClientNameCtrl.value)
      .subscribe(res => {
        this.projectName = res.data;
        this.filteredProjects.next(this.projectName.slice());
      }, error => { console.log(error) });
    this.SearchInvoiceReport()
  }
  SearchInvoiceReport() {

    if (this.ProjectNameCtrl.value !== null) {
      this.searchInvoiceReport.projectId = this.ProjectNameCtrl.value
    }
    if (this.ClientNameCtrl.value !== null) {
      this.searchInvoiceReport.clientId = this.ClientNameCtrl.value
    }

    if (this.FromDate.value !== null) {
      this.searchInvoiceReport.fromDate = new Date(this.FromDate.value).toLocaleDateString();
    }
    if (this.ToDate.value !== null) {
      this.searchInvoiceReport.toDate = new Date(this.ToDate.value).toLocaleDateString();
    }
    this.searchInvoiceReport.pageSize = 0;
    this.searchInvoiceReport.page = 0;
    this._reportService.searchInvoiceReport(this.searchTerm$, this.searchInvoiceReport)
      .subscribe(res => {
        this.invoiceReportList = res.data;
        if (this.invoiceReportList == null) {
          this.status = "No Record Found"
        }
      }, error => { console.log(error) });
  }
  clientNameCss: any
  projectNameCss: any
  invoiceDateCss: any
  amountCss: any
  ProjectManagerCss: any
  AccountManagerCss: any
  paymentStatusCss: any
  currencyNameCss: any;

  cleanCssClass() {
    this.clientNameCss = '';
    this.projectNameCss = '';
    this.invoiceDateCss = '';
    this.amountCss = '';
    this.ProjectManagerCss = ''
    this.AccountManagerCss = '';
    this.paymentStatusCss = '';
    this.currencyNameCss = '';
  }


  sort(sortBy: any) {
    this.cleanCssClass();
    let str = this.searchInvoiceReport.columnName
    if (str !== sortBy) {
      this.searchInvoiceReport.order = 'DESC'
      this.searchInvoiceReport.columnName = sortBy;
      this.searchInvoiceReport.order = this.searchInvoiceReport.order == 'ASC' ? 'DESC' : 'ASC';
    }
    else {
      this.searchInvoiceReport.columnName = sortBy;
      this.searchInvoiceReport.order = this.searchInvoiceReport.order == 'ASC' ? 'DESC' : 'ASC';
    }
    switch (sortBy) {
      case "ClientName": this.clientNameCss = this.searchInvoiceReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "ProjectName": this.projectNameCss = this.searchInvoiceReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "InvoiceDate": this.invoiceDateCss = this.searchInvoiceReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "CurrencyName": this.currencyNameCss = this.searchInvoiceReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "TotalAmount": this.amountCss = this.searchInvoiceReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "ProjectManagerName": this.ProjectManagerCss = this.searchInvoiceReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "AccountManagerName": this.AccountManagerCss = this.searchInvoiceReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "PaymentStatus": this.paymentStatusCss = this.searchInvoiceReport.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      default: break;
    }
    this._reportService.searchEntries(this.searchInvoiceReport)
      .subscribe(res => {
        this.invoiceReportList = res.data;
      });
  }
  reset() {
    this.ProjectNameCtrl.reset();
    this.ProjectNameCtrl.setValue(0);
    this.searchInvoiceReport.projectId = 0
    this.ClientNameCtrl.reset();
    this.ClientNameCtrl.setValue(0);
    this.searchInvoiceReport.clientId = 0
    this.FromDate.reset();
    this.ToDate.reset();
    this.searchInvoiceReport.fromDate = ''
    this.searchInvoiceReport.toDate = ''
    this._reportService.refreshNeeded$
      .subscribe(() => {
        this.getInvoiceReport();
      });
    this._reportService.getProjectName().subscribe(res => {
      this.projectName = res.data;

      this.filteredProjects.next(this.projectName.slice());
    });
    this.getInvoiceReport();
  }
  ExportAsPdf() {
    this.excel = [];
    this.invoiceReportList.forEach(row => {
      this.excel.push({
        'Client Name': row.clientName, 'Project Name': row.projectName,
        'Account Manager': row.accountManagerName, 'Project Manager': row.projectManagerName,
        'Currency': row.currencyName, 'Amount': row.totalAmount, 'Invoice Date': row.invoiceDate
        , 'Payment Status': row.paymentStatus
      });
    });
    this._reportService.exportAsExcelFile(this.excel, 'Total Invoicing Report');
  }
  pageSizeDD() {

    this.pageSize = this.pageSizeCtrl.value;
  }
}
