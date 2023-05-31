import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Invoice, Report, InvoicePartition } from 'app/models/invoice';
import { InvoiceService } from 'app/services/invoiceservice.service';
import { MatDialog, MatSelect, MAT_DIALOG_DATA } from '@angular/material';
import { ReportComponent } from 'app/report/report.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { SharedModule } from 'app/shared/shared.module';
import { Globals } from 'app/services/globalfile';
import { Overlay, ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';


interface DropDown {
  id: string;
  name: string;
  amount: string;
  sign: string;
  currencyId: number;
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})


export class InvoiceComponent implements OnInit {

  scrollStrategy: ScrollStrategy;
  myModel = false
  invoiceHeader = ''
  submitted = false
  status = true
  subtotal: number = 0
  pageSize: number = 10;
  currencyId: number = 0
  sign: string = ' '
  milestneIdList: string = ' '

  dynamicForm: FormGroup;

  invoiceList: Invoice[]
  chnageList: any = []

  public ProjectNameCtrl: FormControl = new FormControl('', [Validators.required]);
  public ProjectNameFilterCtrl: FormControl = new FormControl();
  public ClientNameCtrl: FormControl = new FormControl('', [Validators.required]);
  public ClientNameFilterCtrl: FormControl = new FormControl();
  public pageSizeCtrl: FormControl = new FormControl();

  public filteredProjects: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredClients: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);


  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  private _onDestroy = new Subject<void>();
  searchTerm$ = new Subject<string>();

  projectName: DropDown[]
  clientName: DropDown[]
  milestoneName: DropDown[]
  CurrencyName: DropDown[]

  public popoverTitle: string = 'Delete Collection';
  public popoverMessage: string = 'Are You Sure You Want To Delete This Collection?';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  PaymentMethod: any = [
    {
      name: "CHECK",
      value: "check"
    },
    {
      name: "PAYPAL",
      value: "paypal"
    }
  ]

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


  Date1: FormControl = new FormControl();
  Date2: FormControl = new FormControl();
  Date3: FormControl = new FormControl();
  InvoiceForm = new FormGroup
    ({
      MileStone: new FormControl(),
      InvoiceName: new FormControl('', [Validators.required]),
      PaymentStatusValue: new FormControl('', [Validators.required]),
      PaymentMethodValue: new FormControl('', [Validators.required]),
      Amount1: new FormControl(''),
      Amount2: new FormControl(''),
      Amount3: new FormControl(''),
    });
  PartionForm: FormGroup;
  constructor(sso: ScrollStrategyOptions, private sharedModule: SharedModule, private _invoiceService: InvoiceService, private globals: Globals, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public Data: any, private fb: FormBuilder) {
    this.PartionForm = this.fb.group({
      List: this.fb.array([]),
    });


  }

  ngOnInit() {
    console.log("inovice id", this.Data.id)
    let rn = this.globals.RoleName()
    this._invoiceService.getInvoicePartition(this.Data.id).subscribe(res => {
      res.data.forEach(element => {
        this.AddPartition(element)
      });
    })
    document.getElementById('ms').style.display = "none";
    this._invoiceService.getProjectName().subscribe(res => {
      this.projectName = res.data;
      this.filteredProjects.next(this.projectName.slice());
    });

    this._invoiceService.getClientName().subscribe(res => {
      this.clientName = res.data;
      this.filteredClients.next(this.clientName.slice());
    });

    this._invoiceService.getCurrency().subscribe(res => {
      this.CurrencyName = res.data;
    });

    this.ProjectNameFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.FilterProjects();
    });

    this.ClientNameFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.FilterClients();
    });

    this.invoiceHeader = "Add Invoice"

    if (this.Data.id > 0) {
      if (rn != 'Admin' && rn != 'MIS') {
        this.InvoiceForm.controls['PaymentStatusValue'].disable();
      }
      this.invoiceHeader = "Update Invoice"
      this.myModel = true;
      document.getElementById('ms').style.display = "inline";
      this._invoiceService.getInvoiceById(this.Data.id).subscribe(res => {
        this.InvoiceForm.controls['InvoiceName'].setValue(res.data[0].invoiceTitle);
        this.ClientNameCtrl.setValue(res.data[0].clientId);
        this.ProjectNameCtrl.setValue(res.data[0].projectId);

        this._invoiceService.getMilestoneByInvoiceId(this.Data.id).subscribe(res => {
          this.milestoneName = res.data
          res.data.forEach(element => { this.chnageList.push(element.id); });

        });
        this.sign = res.data[0].currencySign
        this.subtotal = res.data[0].amount
        this.currencyId = res.data[0].currencyId
        this.InvoiceForm.controls['PaymentMethodValue'].setValue(res.data[0].paymentMethod);
        this.InvoiceForm.controls['PaymentStatusValue'].setValue(res.data[0].paymentStatus);
        this.InvoiceForm.controls['Amount1'].setValue(res.data[0].amountPaid1);
        if (res.data[0].date1 != '1900-01-01T00:00:00' && res.data[0].date1 != '0001-01-01T00:00:00')
          this.Date1.setValue(res.data[0].date1);
        this.InvoiceForm.controls['Amount2'].setValue(res.data[0].amountPaid2);
        if (res.data[0].date2 != '1900-01-01T00:00:00' && res.data[0].date2 != '0001-01-01T00:00:00')
          this.Date2.setValue(res.data[0].date2);
        this.InvoiceForm.controls['Amount3'].setValue(res.data[0].amountPaid3);
        if (res.data[0].date3 != '1900-01-01T00:00:00' && res.data[0].date3 != '0001-01-01T00:00:00')
          this.Date3.setValue(res.data[0].date3);
      })
    }
    else {
      if (rn != 'Admin') {
        this.PaymentStatus = this.PaymentStatus.filter(item => item.name !== 'PAID')
      }
    }

  }
  List(): FormArray {
    return this.PartionForm.get("List") as FormArray
  }
  NewPartition(Data): FormGroup {
    return this.fb.group({
      partitionId: Data ? Data.partitionId : 0,
      invoiceId: Data ? Data.invoiceId : 0,
      amount: Data ? Data.amount : '',
      partitionAmountDate: Data ? Data.partitionAmountDate : '',
    })
  }
  AddPartition(Data?: any) {
    this.List().push(this.NewPartition(Data));
  }

  RemovePartition(i: number, ind: number) {
    console.log("partitionId", i)
    this._invoiceService.deleteInvoiceParition(i).subscribe(res => {
      this.sharedModule.alertNotification(res.message, 'success');
    })
    this.List().removeAt(ind);
  }
  onPart() {
    const invoicePartition = new InvoicePartition();
    invoicePartition.invoiceId = this.Data.id;
    invoicePartition.createdBy = this.globals.UserId();
    invoicePartition.modifiedBy = this.globals.UserId();
    invoicePartition.list = this.PartionForm.value.List
    this._invoiceService.addInvoicePartition(invoicePartition).subscribe(res => {
      if (res.status) { alert(res.message) }
    })
    console.log(this.PartionForm.value.List)
  }
  ngAfterViewInit() { this.setInitialValue(); }
  ngOnDestroy() { this._onDestroy.next(); this._onDestroy.complete(); }

  GetClientProject() {
    document.getElementById('ms').style.display = "none";
    this.subtotal = 0
    this._invoiceService.getClientProject(this.ClientNameCtrl.value)
      .subscribe(res => {
        this.projectName = res.data;
        this.filteredProjects.next(this.projectName.slice());
      }, error => { console.log(error) });

  }

  GetMileStone() {

    document.getElementById('ms').style.display = "inline";
    this.subtotal = 0;
    this._invoiceService.getMileStoneName(this.ProjectNameCtrl.value, this.ClientNameCtrl.value).subscribe(res => {
      if (res.status == false) {
        document.getElementById('ms').style.display = "none";
      }
      else {
        this.milestoneName = res.data
      }
    }, error => { console.log(error) });
  }

  GetSelectedMileStone(amount, e, sign, cid, mid) {
    this.sign = sign
    this.currencyId = cid
    if (e.target.checked) {
      this.subtotal = this.subtotal + parseInt(amount)
      this.chnageList.push(mid);
    }
    else {
      const index: number = this.chnageList.indexOf(mid);
      this.subtotal = this.subtotal - parseInt(amount)
      this.chnageList.splice(index, 1);
    }
  }

  private setInitialValue() {
    this.filteredProjects.pipe(take(0), takeUntil(this._onDestroy)).subscribe(() => {
      this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
    });
  }

  get f() { return this.InvoiceForm.controls; }

  private FilterProjects() {
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
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(this.clientName.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  onSubmit() {
    this.submitted = true;
    const invoice = new Invoice();
    invoice.invoiceTitle = this.InvoiceForm.controls['InvoiceName'].value;
    invoice.clientId = this.ClientNameCtrl.value;
    invoice.projectId = this.ProjectNameCtrl.value;
    invoice.currencyId = this.currencyId
    this.chnageList.forEach(element => { this.milestneIdList = this.milestneIdList + ',' + element });
    invoice.milestoneid = this.milestneIdList
    invoice.amount = this.subtotal
    invoice.paymentMethod = this.InvoiceForm.controls['PaymentMethodValue'].value;
    invoice.paymentStatus = this.InvoiceForm.controls['PaymentStatusValue'].value;
    invoice.companyId = this.globals.companyId();

    if (this.InvoiceForm.controls['Amount1'].value != "") {
      invoice.amountPaid1 = parseInt(this.InvoiceForm.controls['Amount1'].value);
      invoice.date1 = new Date(this.Date1.value).toLocaleDateString();
    }
    if (this.InvoiceForm.controls['Amount2'].value != "") {
      invoice.amountPaid2 = parseInt(this.InvoiceForm.controls['Amount2'].value);
      invoice.date2 = new Date(this.Date2.value).toLocaleDateString();
    }
    if (this.InvoiceForm.controls['Amount3'].value != "") {
      invoice.amountPaid3 = parseInt(this.InvoiceForm.controls['Amount3'].value);
      invoice.date3 = new Date(this.Date3.value).toLocaleDateString();
    }
    if (this.Data.id != 0) { //  Update Data
      invoice.modifiedBy = this.globals.UserId();
      this._invoiceService.updateInvoice(this.Data.id, invoice).subscribe(res => {
        if (res.status) { }
      })
      const invoicePartition = new InvoicePartition();
      invoicePartition.invoiceId = this.Data.id;
      invoicePartition.createdBy = this.globals.UserId();
      invoicePartition.modifiedBy = this.globals.UserId();
      invoicePartition.list = this.PartionForm.value.List
      this._invoiceService.addInvoicePartition(invoicePartition).subscribe(res => {
        if (res.status) { }
      })
      console.log(this.PartionForm.value.List)
      this.dialog.closeAll();
    }

    else { // Add Data  
      invoice.createdBy = this.globals.UserId();
      invoice.modifiedBy = this.globals.UserId();
      this._invoiceService.addInvoice(invoice).subscribe(res => {
        if (res.status) { }
      })
      this.dialog.closeAll();
    }
    this.dialog.open(ReportComponent, { data: { projectid: this.ProjectNameCtrl.value, clientid: this.ClientNameCtrl.value, milestone: this.milestneIdList }, height: '1000px' });
  }
  Amount(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
