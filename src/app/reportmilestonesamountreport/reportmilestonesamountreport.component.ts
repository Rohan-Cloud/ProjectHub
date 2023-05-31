import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { PageEvent, MatSelect, MatDialog } from '@angular/material';
import { ReportMilestoneAmount, SeacrhReportMilestoneAmount } from 'app/models/Reports';
import { SharedModule } from 'app/shared/shared.module';
import { Globals } from 'app/services/globalfile';
import { MileStoneService } from 'app/services/milestone.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil, take } from 'rxjs/operators';
import { MileStone } from 'app/models/milestone';
import { ReportsService } from 'app/services/report.service';
interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-reportmilestonesamountreport',
  templateUrl: './reportmilestonesamountreport.component.html',
  styleUrls: ['./reportmilestonesamountreport.component.scss']
})
export class ReportmilestonesamountreportComponent implements OnInit {

  public ProjectNameCtrl: FormControl = new FormControl();
  public ProjectNameFilterCtrl: FormControl = new FormControl();
  public ClientNameCtrl: FormControl = new FormControl();
  public ClientNameFilterCtrl: FormControl = new FormControl();
  public StatusCtrl: FormControl = new FormControl();
  public StatusFilterCtrl: FormControl = new FormControl();
  public FromDate: FormControl = new FormControl();
  public ToDate: FormControl = new FormControl();

  public selected = "10"
  excel = []
  projectName: DropDown[]
  clientName: DropDown[]
  statusName: DropDown[]

  public filteredProjects: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredClients: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredStatus: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);

  pageEvent: PageEvent

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  private _onDestroy = new Subject<void>();
  searchTerm$ = new Subject<string>();
  mileStoneAmountList: ReportMilestoneAmount[];
  col = [];
  len: number
  status = ''
  pageSize: number = 10;
  RoleName = ''

  StartDate: FormControl = new FormControl();
  Todate: FormControl = new FormControl();
  pageSizeCtrl: FormControl = new FormControl();
  constructor(private _reportService: ReportsService, private _mileStoneService: MileStoneService, private spinner: NgxSpinnerService, private dialog: MatDialog, private sharedModule: SharedModule, private globals: Globals) { }
  searchMileStone = new SeacrhReportMilestoneAmount();
  ngOnInit() {
    this.RoleName = this.globals.RoleName()
    this._mileStoneService.refreshNeeded$
      .subscribe(() => {
        this.getAllMileStoneList();
      });
    this.getAllMileStoneList();

    this._mileStoneService.getProjectName().subscribe(res => {
      this.projectName = res.data;

      this.filteredProjects.next(this.projectName.slice());
    });

    this._mileStoneService.getClientName().subscribe(res => {
      this.clientName = res.data;

      this.filteredClients.next(this.clientName.slice());
    });

    this._mileStoneService.getProjectStatus().subscribe(res => {
      this.statusName = res.data;

      this.filteredStatus.next(this.statusName.slice());
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

    this.StatusFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStatus();
      });
  }
  GetClientProject() {
    this._mileStoneService.getClientProject(this.ClientNameCtrl.value)
      .subscribe(res => {
        this.projectName = res.data;
        this.filteredProjects.next(this.projectName.slice());
      }, error => { console.log(error) });
    this.SearchMileStone()
  }
  private getAllMileStoneList() {
    this.status = "Loading...."
    this._mileStoneService.getMileStone().subscribe(res => {
      this.mileStoneAmountList = res.data;
      this.col = res.data;
      if (this.mileStoneAmountList == null) {
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

  private filterStatus() {
    if (!this.statusName) {
      return;
    }
    let search = this.StatusFilterCtrl.value;
    if (!search) {
      this.filteredStatus.next(this.statusName.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStatus.next(
      this.statusName.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }
  //Filter Project END


  //Search Milestone START
  SearchMileStone() {
    if (this.ProjectNameCtrl.value !== null) {
      this.searchMileStone.projectId = this.ProjectNameCtrl.value
    }
    if (this.ClientNameCtrl.value !== null) {
      this.searchMileStone.clientId = this.ClientNameCtrl.value
    }
    if (this.StatusCtrl.value !== null) {
      this.searchMileStone.Status = this.StatusCtrl.value
    }
    if (this.StartDate.value !== null) {
      this.searchMileStone.fromDate = new Date(this.StartDate.value).toLocaleDateString();
    }
    if (this.Todate.value !== null) {
      this.searchMileStone.toDate = new Date(this.Todate.value).toLocaleDateString();
    }
    this.searchMileStone.pageSize = 0;
    this.searchMileStone.page = 0;
    this._mileStoneService.searchMileStone(this.searchTerm$, this.searchMileStone)
      .subscribe(res => {
        this.mileStoneAmountList = res.data;
        if (this.mileStoneAmountList == null) {
          this.status = "No Record Found"
        }
      }, error => { console.log(error) });
  }
  //Search Milestone END

  //Pagination START
  pageSizeDD() {

    this.pageSize = this.pageSizeCtrl.value;
  }
  //Pagination END
  ExportAsPdf() {
    this.excel = [];
    this.mileStoneAmountList.forEach(row => {
      this.excel.push({
        'Milestone Name': row.Name, 'Client': row.ClientName,
        'Project': row.ProjectName, 'Hours': row.Hour,
        'Amount': row.Amount, 'Currency': row.CurrencyName,
        'Start Date': row.StartDate, 'End Date': row.EndDate
        , 'Status': row.StatusName
      });
    });
    this._reportService.exportAsExcelFile(this.excel, 'Total Invoicing Report');
  }

  //sortData START
  nameCss: any
  clientNameCss: any
  projectNameCss: any
  hourCss: any
  statusCss: any
  amountCss: any
  currencyNameCss: any
  startDateCss: any
  endDateCss: any
  modifiedDateCss: any


  cleanCssClass() {
    this.nameCss = '';
    this.clientNameCss = '';
    this.projectNameCss = '';
    this.hourCss = '';
    this.amountCss = '';
    this.currencyNameCss = '';
    this.startDateCss = '';
    this.endDateCss = '';
    this.modifiedDateCss = '';
    this.statusCss = '';
  }
  sort(sortBy: any) {
    this.cleanCssClass();
    let str = this.searchMileStone.columnName
    if (str !== sortBy) {
      this.searchMileStone.order = 'DESC'
      this.searchMileStone.columnName = sortBy;
      this.searchMileStone.order = this.searchMileStone.order == 'ASC' ? 'DESC' : 'ASC';
    }
    else {
      this.searchMileStone.columnName = sortBy;
      this.searchMileStone.order = this.searchMileStone.order == 'ASC' ? 'DESC' : 'ASC';
    }
    switch (sortBy) {
      case "Name": this.nameCss = this.searchMileStone.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "ClientName": this.clientNameCss = this.searchMileStone.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "ProjectName": this.projectNameCss = this.searchMileStone.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "Hour": this.hourCss = this.searchMileStone.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "Amount": this.amountCss = this.searchMileStone.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "Status": this.statusCss = this.searchMileStone.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "CurrencyName": this.currencyNameCss = this.searchMileStone.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "StartDate": this.startDateCss = this.searchMileStone.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "EndDate": this.endDateCss = this.searchMileStone.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "ModifiedDate": this.modifiedDateCss = this.searchMileStone.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;

      default: break;
    }
    this._mileStoneService.searchEntries(this.searchMileStone)
      .subscribe(res => {
        this.mileStoneAmountList = res.data;
      });
  }

  //sortData END

  // Reset Filter START
  reset() {
    this.StartDate.reset();
    this.Todate.reset();
    this.searchMileStone.fromDate = ''
    this.searchMileStone.toDate = ''
    this.ProjectNameCtrl.reset();
    this.ProjectNameCtrl.setValue(0);
    this.searchMileStone.projectId = 0

    this.ClientNameCtrl.reset();
    this.ClientNameCtrl.setValue(0);
    this.searchMileStone.clientId = 0

    this.StatusCtrl.reset();
    this.StatusCtrl.setValue(0);
    this.searchMileStone.Status = 0

    this._reportService.refreshNeeded$
      .subscribe(() => {
        this.getAllMileStoneList();
      });
    this.getAllMileStoneList();

  }
  // Reset Filter END


  //Open Popup Employee Componant



}
