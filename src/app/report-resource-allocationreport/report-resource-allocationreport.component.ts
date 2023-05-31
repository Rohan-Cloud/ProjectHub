import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect, PageEvent } from '@angular/material';
import { ReportResourceAllocation, SearchResourceAllocation } from 'app/models/Reports';
import { ReportsService } from 'app/services/report.service';
import { Globals } from 'app/services/globalfile';
import { takeUntil, take } from 'rxjs/operators';
interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-report-resource-allocationreport',
  templateUrl: './report-resource-allocationreport.component.html',
  styleUrls: ['./report-resource-allocationreport.component.scss']
})
export class ReportResourceAllocationreportComponent implements OnInit {

  public ProjectNameCtrl: FormControl = new FormControl();
  public ProjectNameFilterCtrl: FormControl = new FormControl();

  public FromDate: FormControl = new FormControl();
  public ToDate: FormControl = new FormControl();

  public selected = "10"
  excel = []
  projectName: DropDown[]


  DetailActive = "false"
  public filteredProjects: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);



  pageEvent: PageEvent

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  private _onDestroy = new Subject<void>();
  searchTerm$ = new Subject<string>();
  ResourceAllocationList: ReportResourceAllocation[];
  col = [];
  len: number
  status = ''
  pageSize: number = 10;
  RoleName = ''

  StartDate: FormControl = new FormControl();
  Todate: FormControl = new FormControl();
  pageSizeCtrl: FormControl = new FormControl();
  constructor(private _reportService: ReportsService, private globals: Globals) { }
  searchResourceAllocation = new SearchResourceAllocation();
  ngOnInit() {
    this.RoleName = this.globals.RoleName()
    this._reportService.refreshNeeded$
      .subscribe(() => {
        this.getResourceAllocationList();
      });
    this.getResourceAllocationList();

    this._reportService.getProjectName().subscribe(res => {
      this.projectName = res.data;

      this.filteredProjects.next(this.projectName.slice());
    });

    this.ProjectNameFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProjects();
      });



  }

  private getResourceAllocationList() {
    this.status = "Loading...."
    this._reportService.getResourceAllcoationReport().subscribe(res => {
      this.ResourceAllocationList = res.data;
      this.col = res.data;
      if (this.ResourceAllocationList == null) {
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


  //Filter Project END


  //Search Milestone START
  SearchMileStone() {

    if (this.ProjectNameCtrl.value !== null) {
      this.searchResourceAllocation.projectId = this.ProjectNameCtrl.value
    }


    if (this.StartDate.value !== null) {
      this.searchResourceAllocation.fromDate = new Date(this.StartDate.value).toLocaleDateString();
    }
    if (this.Todate.value !== null) {
      this.searchResourceAllocation.toDate = new Date(this.Todate.value).toLocaleDateString();
    }
    this.searchResourceAllocation.pageSize = 0;
    this.searchResourceAllocation.page = 0;

    this._reportService.SearchResourceAllcoationReport(this.searchTerm$, this.searchResourceAllocation)
      .subscribe(res => {
        this.ResourceAllocationList = res.data;
        if (this.ResourceAllocationList == null) {
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
    this.ResourceAllocationList.forEach(row => {
      this.excel.push({
        'Employee Name': row.name, 'Location': row.locationName,
        'Role': row.roleName, 'Project List': row.projectsName,

        // 'Start Date': row.inv,'End Date': row.EndDate
        // ,'Status': row.StatusName
      });
    });
    this._reportService.exportAsExcelFile(this.excel, 'Resource Allocation Report');
  }

  //sortData START
  nameCss: any
  roleNameCss: any
  locationNameCss: any
  projectsNameCss: any



  cleanCssClass() {
    this.nameCss = '';
    this.roleNameCss = '';
    this.locationNameCss = '';
    this.projectsNameCss = '';
  }

  sort(sortBy: any) {
    this.cleanCssClass();
    let str = this.searchResourceAllocation.columnName
    if (str !== sortBy) {
      this.searchResourceAllocation.order = 'DESC'
      this.searchResourceAllocation.columnName = sortBy;
      this.searchResourceAllocation.order = this.searchResourceAllocation.order == 'ASC' ? 'DESC' : 'ASC';
    }
    else {
      this.searchResourceAllocation.columnName = sortBy;
      this.searchResourceAllocation.order = this.searchResourceAllocation.order == 'ASC' ? 'DESC' : 'ASC';
    }
    switch (sortBy) {
      case "Name": this.nameCss = this.searchResourceAllocation.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "RoleName": this.roleNameCss = this.searchResourceAllocation.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "LocationName": this.locationNameCss = this.searchResourceAllocation.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case "ProjectsName": this.projectsNameCss = this.searchResourceAllocation.order == 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;

      default: break;
    }
    this._reportService.SearchRAR(this.searchResourceAllocation)
      .subscribe(res => {
        this.ResourceAllocationList = res.data;
      });
  }

  //sortData END

  // Reset Filter START
  reset() {
    this.StartDate.reset();
    this.Todate.reset();
    this.searchResourceAllocation.fromDate = ''
    this.searchResourceAllocation.toDate = ''
    this.ProjectNameCtrl.reset();
    this.ProjectNameCtrl.setValue(0);
    this.searchResourceAllocation.projectId = 0
    this.DetailActive = "false"

    this._reportService.refreshNeeded$
      .subscribe(() => {
        this.getResourceAllocationList();
      });
    this.getResourceAllocationList();
  }

}
