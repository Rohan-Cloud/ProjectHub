import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Invoice, SearchInvoice } from 'app/models/invoice';
import { InvoiceService } from 'app/services/invoiceservice.service';
import { MatDialog, MatSelect } from '@angular/material';
import { ReportComponent } from 'app/report/report.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { InvoiceComponent } from 'app/invoice/invoice.component';
import { Globals } from 'app/services/globalfile';

interface DropDown {
  id: string;
  name: string;
}

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {

  public popoverTitle: string = 'Delete Invoice';
  public popoverMessage: string = 'Are You Sure You Want To Delete Invoice?';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  searchInvoice = new SearchInvoice();
  invoiceList: Invoice[]
  projectName: DropDown[]
  clientName: DropDown[]
  status = ''
  pageSize: number = 10;
  clientId = 0
  projectId = 0
  milestneListId: string = ' ';
  RoleName = ''

  StartDate: FormControl = new FormControl();
  Todate: FormControl = new FormControl();
  pageSizeCtrl: FormControl = new FormControl();

  PaymentStatus: any = [
    {
      name: "PAID",
      value: "paid"
    },
    {
      name: "PENDING",
      value: "pending"
    }
  ]

  public ProjectNameCtrl: FormControl = new FormControl();
  public ProjectNameFilterCtrl: FormControl = new FormControl();
  public ClientNameCtrl: FormControl = new FormControl();
  public ClientNameFilterCtrl: FormControl = new FormControl();

  public filteredProjects: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredClients: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  private _onDestroy = new Subject<void>();
  searchTerm$ = new Subject<string>();

  InvoiceFormGroup = new FormGroup
    ({
      Keyword: new FormControl(''),
      PaymentStatusValue: new FormControl()
    });

  constructor(private _invoiceService: InvoiceService, private dialog: MatDialog, private globals: Globals) { }

  ngOnInit() {
    this.RoleName = this.globals.RoleName()
    this._invoiceService.refreshNeeded$.subscribe(() => {
      this.GetAllInvoiceList();
    });
    this.GetAllInvoiceList();

    this._invoiceService.getProjectName().subscribe(res => {
      this.projectName = res.data;
      this.filteredProjects.next(this.projectName.slice());
    });

    this._invoiceService.getClientName().subscribe(res => {
      this.clientName = res.data;
      this.filteredClients.next(this.clientName.slice());
    });

    this.ProjectNameFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.FilterProjects();
    });

    this.ClientNameFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.FilterClients();
    });
  }
  ngAfterViewInit() { this.SetInitialValue(); }
  ngOnDestroy() { this._onDestroy.next(); this._onDestroy.complete(); }

  GetAllInvoiceList() {
    this.status = "Loading...."
    this._invoiceService.getinvoice().subscribe(res => {
      this.invoiceList = res.data;
      if (this.invoiceList == null) {
        this.status = "No Record Found"
      }
    });
  }

  GetClientProject() {
    this._invoiceService.getClientProject(this.ClientNameCtrl.value).subscribe(res => {
      this.projectName = res.data;
      this.filteredProjects.next(this.projectName.slice());
    }, error => { console.log(error) });
    this.SearchInvoice();
  }

  private SetInitialValue() {
    this.filteredProjects.pipe(take(0), takeUntil(this._onDestroy)).subscribe(() => {
      this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
    });
  }

  private FilterProjects() {
    if (!this.projectName) {
      return;
    }
    let search = this.ProjectNameFilterCtrl.value;
    if (!search) {
      this.filteredProjects.next(this.projectName.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    this.filteredProjects.next(this.projectName.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  private FilterClients() {
    if (!this.clientName) {
      return;
    }
    let search = this.ClientNameFilterCtrl.value;
    if (!search) {
      this.filteredClients.next(this.clientName.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(this.clientName.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  invoiceTitleCss: any
  clientNameCss: any
  projectNameCss: any
  currencyNameCss: any
  amountCss: any
  paymentMethodCss: any
  paymentStatusCss: any
  modifiedDateCss: any

  CleanCssClass() {
    this.invoiceTitleCss = " "
    this.clientNameCss = " "
    this.projectNameCss = " "
    this.currencyNameCss = " "
    this.amountCss = " "
    this.paymentMethodCss = " "
    this.paymentStatusCss = " "
    this.modifiedDateCss = " "
  }

  Sort(sortBy: any) {
    this.CleanCssClass();
    let str = this.searchInvoice.columnName
    if (str !== sortBy) {
      this.searchInvoice.order = 'DESC'
      this.searchInvoice.columnName = sortBy;
      this.searchInvoice.order = this.searchInvoice.order == 'ASC' ? 'DESC' : 'ASC';
    }
    else {
      this.searchInvoice.columnName = sortBy;
      this.searchInvoice.order = this.searchInvoice.order == 'ASC' ? 'DESC' : 'ASC';
    }
    switch (sortBy) {
      case "InvoiceTitle": this.invoiceTitleCss = this.searchInvoice.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "ClientName": this.clientNameCss = this.searchInvoice.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "ProjectName": this.projectNameCss = this.searchInvoice.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "CurrencyName": this.currencyNameCss = this.searchInvoice.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "Amount": this.amountCss = this.searchInvoice.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "PaymentMethod": this.paymentMethodCss = this.searchInvoice.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "PaymentStatus": this.paymentStatusCss = this.searchInvoice.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "ModifiedDate": this.modifiedDateCss = this.searchInvoice.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      default: break;
    }
    this._invoiceService.searchEntries(this.searchInvoice).subscribe(res => {
      this.invoiceList = res.data;
      if (this.invoiceList == null) {
        this.status = "No Record Found"
      }
    });
  }

  pageSizeDropDown() {
    this.pageSize = this.pageSizeCtrl.value;
  }

  SearchInvoice() {
    this.searchInvoice.keyWord = this.InvoiceFormGroup.controls["Keyword"].value;
    if (this.ProjectNameCtrl.value !== null) {
      this.searchInvoice.projectId = this.ProjectNameCtrl.value
    }
    if (this.ClientNameCtrl.value !== null) {
      this.searchInvoice.clientId = this.ClientNameCtrl.value
    }
    if (this.InvoiceFormGroup.controls["PaymentStatusValue"].value !== null) {
      this.searchInvoice.paymentStatus = this.InvoiceFormGroup.controls["PaymentStatusValue"].value
    }
    if (this.StartDate.value !== null) {
      this.searchInvoice.fromDate = new Date(this.StartDate.value).toLocaleDateString();
    }
    if (this.Todate.value !== null) {
      this.searchInvoice.toDate = new Date(this.Todate.value).toLocaleDateString();
    }
    this.searchInvoice.pageSize = 0;
    this.searchInvoice.page = 0;
    this._invoiceService.searchInvoice(this.searchTerm$, this.searchInvoice).subscribe(res => {
      this.invoiceList = res.data;
    }, error => { console.log(error) });
  }

  deleteInvoice(id: number) {
    this._invoiceService.deleteInvoice(id).subscribe(data => {
      this._invoiceService.getinvoice().subscribe(res => {
        this.invoiceList = res.data;
      });
    });
  }

  Reset() {
    this.InvoiceFormGroup.controls["Keyword"].reset();
    this.InvoiceFormGroup.controls["Keyword"].setValue('');
    this.searchInvoice.keyWord = '';
    this.StartDate.reset();
    this.Todate.reset();
    this.searchInvoice.fromDate = ''
    this.searchInvoice.toDate = ''
    this.ProjectNameCtrl.reset();
    this.ProjectNameCtrl.setValue(0);
    this.searchInvoice.projectId = 0
    this.ClientNameCtrl.reset();
    this.ClientNameCtrl.setValue(0);
    this.searchInvoice.clientId = 0
    this.InvoiceFormGroup.controls["PaymentStatusValue"].reset();
    this.InvoiceFormGroup.controls["PaymentStatusValue"].setValue(' ');
    this.searchInvoice.paymentStatus = ' '
    this._invoiceService.refreshNeeded$
      .subscribe(() => {
        this.GetAllInvoiceList();
      });
    this._invoiceService.getProjectName().subscribe(res => {
      this.projectName = res.data;
      this.filteredProjects.next(this.projectName.slice());
    });
    this.GetAllInvoiceList();
  }

  updateInvoice(id: number) {
    this.dialog.open(InvoiceComponent, { data: { id: id } });
  }
  onCreate() {
    this.dialog.open(InvoiceComponent, { data: { id: 0 } });
  }
  DownLoadPdf(id) {
    let milestneListId = ''
    this._invoiceService.getInvoiceById(id).subscribe(res => {
      this.clientId = res.data[0].clientId;
      this.projectId = res.data[0].projectId;
      this._invoiceService.getMilestoneByInvoiceId(id).subscribe(res => {
        res.data.forEach(element => { milestneListId = milestneListId + ',' + element.id.toString() });
        this.dialog.open(ReportComponent, { data: { projectid: this.projectId, clientid: this.clientId, milestone: milestneListId }, height: '1000px' });
      });
    });
  }
}
