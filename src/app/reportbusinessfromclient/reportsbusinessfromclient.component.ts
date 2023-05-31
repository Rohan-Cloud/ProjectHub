import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsService } from 'app/services/report.service';
import { BusinessFromClientReport, Searchbusinessfromclientreport } from 'app/models/Reports';
import { FormControl} from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect, PageEvent } from '@angular/material';
import { takeUntil, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-reportsbusinessfromclient',
  templateUrl: './reportsbusinessfromclient.component.html',
  styleUrls: ['./reportsbusinessfromclient.component.scss']
})
export class ReportsbusinessfromclientComponent implements OnInit {

  
  clientNameCss: any
  projectNameCss: any
  accountManagerNameCss: any
  projectManagerNameCss: any
  startDateCss: any
  currencyNameCss:any
  amountCss: any
  status=''
   ClientNameCtrl: FormControl = new FormControl();
   ClientNameFilterCtrl: FormControl = new FormControl();
   FromDate: FormControl = new FormControl();
   ToDate: FormControl = new FormControl();
   pageSizeCtrl: FormControl = new FormControl();

  clientName: DropDown[]
  pageEvent: PageEvent

  public filteredClients: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  private _onDestroy = new Subject<void>();
  searchTerm$ = new Subject<string>();
  excel = [];

  startindex = 0;
  endindex = 2
  len: number;
  pageSize = 10;

  businessFromClientReportList : BusinessFromClientReport[]

  constructor(private _reportService: ReportsService, private http: HttpClient) { }

  // Excel sheet Genration Start
  exportAsXLSX(): void {
    this.excel=[]
    this.businessFromClientReportList.forEach(row => {
      this.excel.push({
        'Client Name': row.clientName, 'Project Name': row.projectName,
        'Account Manager': row.accountManagerName, 'Project Manager': row.projectManagerName,
        'Start Date': row.projectStartDate, 'Amount': row.projectValue
      });
    });
     this._reportService.exportAsExcelFile(this.excel, 'BusinessFromClientReport');
  }
 // Excel sheet Genration End

  searchBusinessFromClientReport = new Searchbusinessfromclientreport();
  searchBusinessFromClientReports() {

    if (this.ClientNameCtrl.value !== null) {
      this.searchBusinessFromClientReport.client = this.ClientNameCtrl.value
    }
    if (this.FromDate.value !== null) {
      this.searchBusinessFromClientReport.fromDate = new Date(this.FromDate.value).toLocaleDateString();
    }
    if (this.ToDate.value !== null) {
      this.searchBusinessFromClientReport.toDate = new Date(this.ToDate.value).toLocaleDateString();
    }
    this._reportService.searchBusinessFromClientReport(this.searchTerm$, this.searchBusinessFromClientReport)
      .subscribe(res => {
        this.businessFromClientReportList = res.data;
        if(this.businessFromClientReportList == null)
        {
          this.status="No Record Found"
        }
      });
  }

  ngOnInit() {
      this._reportService.getClientName().subscribe(res => {
        this.clientName = res.data;
        this.filteredClients.next(this.clientName.slice());
      });

      this.ClientNameFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClients();
      });

    // Display
    this._reportService.refreshNeeded$
    .subscribe(() => {
      this.getBusinessFromClientReport();
    });
  this.getBusinessFromClientReport();
}

private getBusinessFromClientReport() {
  this.status="Loading...."
  this._reportService.getBusinessFromClientReport().subscribe(res => {
    this.businessFromClientReportList = res.data;
    if(this.businessFromClientReportList == null)
    {
      this.status="No Record Found"
    }
   
  });
}
  ngAfterViewInit() {this.SetInitialValue();}
  ngOnDestroy() {this._onDestroy.next(); this._onDestroy.complete(); }

  private SetInitialValue() {
    this.filteredClients
      .pipe(take(0), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
      });
  }

  // Filter Client START
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

  reset() {
    this.ClientNameCtrl.reset();
    this.ClientNameCtrl.setValue(0);
    this.ToDate.reset();
    this.FromDate.reset();

     // Display
     this._reportService.refreshNeeded$
     .subscribe(() => {
       this.getBusinessFromClientReports();
     });
   this.getBusinessFromClientReports();
 }

  private getBusinessFromClientReports() {
   this._reportService.getBusinessFromClientReport().subscribe(res => {
     this.businessFromClientReportList = res.data;
   });
 }

 // Pagination START
 getLength() {
  if (this.len! = 0) {
    return new Array(this.len + 1);
  }
}
  pageSizeDD() {
  this.pageSize = this.pageSizeCtrl.value;
 }
 // Pagination END

 // Sort Data
 cleanCssClass() {
  this.clientNameCss = ''
  this.projectNameCss = ''
  this.accountManagerNameCss = ''
  this.projectManagerNameCss = ''
  this.startDateCss = ''
  this.currencyNameCss=' '
  this.amountCss = ''
}

  sort(sortBy: any) {
  this.cleanCssClass();
  const str = this.searchBusinessFromClientReport.columnName
  if ( str !== sortBy) {
    this.searchBusinessFromClientReport.order = 'DESC'
    this.searchBusinessFromClientReport.columnName = sortBy;
    this.searchBusinessFromClientReport.order = this.searchBusinessFromClientReport.order === 'ASC' ? 'DESC' : 'ASC' ;
  } else  {
    this.searchBusinessFromClientReport.columnName = sortBy;
    this.searchBusinessFromClientReport.order = this.searchBusinessFromClientReport.order === 'ASC' ? 'DESC' : 'ASC' ;
  }
  switch (sortBy) {
    case 'ClientName': this.clientNameCss =
          this.searchBusinessFromClientReport.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'ProjectName': this.projectNameCss =
          this.searchBusinessFromClientReport.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'AccountManager': this.accountManagerNameCss =
          this.searchBusinessFromClientReport.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'ProjectManager': this.projectManagerNameCss =
          this.searchBusinessFromClientReport.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'StartDate': this.startDateCss =
          this.searchBusinessFromClientReport.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'CurrencyName': this.currencyNameCss = this.searchBusinessFromClientReport.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'Amount': this.amountCss = this.searchBusinessFromClientReport.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    default: break;
  }

  this._reportService.searchEntriesBFromC(this.searchBusinessFromClientReport)
      .subscribe(res => {
        this.businessFromClientReportList = res.data;
      });
  }
  // Sort Data End
}




