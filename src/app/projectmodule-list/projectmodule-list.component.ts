
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectModule, SearchProjectModule } from 'app/models/projectmodule';
import { ProjectModuleService } from 'app/services/projectmodule.service';
import { SharedModule } from 'app/shared/shared.module';
import { MatDialog, MatSelect, MatInput } from '@angular/material';
import { ProjectmoduleComponent } from 'app/projectmodule/projectmodule.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplaySubject, Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil, take } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Globals } from 'app/services/globalfile';


interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-projectmodule-list',
  templateUrl: './projectmodule-list.component.html',
  styleUrls: ['./projectmodule-list.component.scss']
})
export class ProjectmoduleListComponent implements OnInit {

  public popoverTitle = 'Delete MileStone';
  public popoverMessage = 'Are You Sure You Want To Delete MileStone?';
  public confirmClicked = false;
  public cancelClicked = false;

  public ProjectNameCtrl: FormControl = new FormControl();
  public ProjectNameFilterCtrl: FormControl = new FormControl();
  public ClientNameCtrl: FormControl = new FormControl();
  public ClientNameFilterCtrl: FormControl = new FormControl();
  public StatusCtrl: FormControl = new FormControl();
  public StatusFilterCtrl: FormControl = new FormControl();


  public FromDate: FormControl = new FormControl();
  public ToDate: FormControl = new FormControl();

  public selected = '10'

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
  projectModuleList: ProjectModule[];
  col = [];
  len: number
  pageSize: number = 10;
  status = ''
  RoleName = ''
  StartDate: FormControl = new FormControl();
  Todate: FormControl = new FormControl();
  pageSizeCtrl: FormControl = new FormControl();
  searchProjectModuleForm = new FormGroup
    ({
      Keyword: new FormControl(''),
    });

  constructor(private _projectModuleService: ProjectModuleService, private spinner: NgxSpinnerService,
    private dialog: MatDialog, private globals: Globals, private sharedModule: SharedModule) { }
  searchProjectModule = new SearchProjectModule();

  ngOnInit() {
    this.RoleName = this.globals.RoleName()
    this._projectModuleService.refreshNeeded$
      .subscribe(() => {
        this.getAllProjectModuleList();
      });
    this.getAllProjectModuleList();

    this._projectModuleService.getProjectName().subscribe(res => {
      this.projectName = res.data;
      this.filteredProjects.next(this.projectName.slice());
    });

    this._projectModuleService.getClientName().subscribe(res => {
      this.clientName = res.data;
      this.filteredClients.next(this.clientName.slice());
    });

    this._projectModuleService.getProjectStatus().subscribe(res => {
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
    this._projectModuleService.getClientProject(this.ClientNameCtrl.value)
      .subscribe(res => {
        this.projectName = res.data;
        this.filteredProjects.next(this.projectName.slice());
      }, error => { console.log(error) });
    this.SearchProjectModule()
  }
  private getAllProjectModuleList() {
    this.status = "Loading...."
    this._projectModuleService.getProjectModule().subscribe(res => {
      this.projectModuleList = res.data;
      this.col = res.data;
      if (this.projectModuleList == null) {
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
  // Filter Project START
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
  // Filter Project END

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
  // Filter Project END



  // Search Milestone START
  SearchProjectModule() {

    this.searchProjectModule.keyWord = this.searchProjectModuleForm.controls['Keyword'].value;
    if (this.ProjectNameCtrl.value !== null) {
      this.searchProjectModule.projectId = this.ProjectNameCtrl.value
    }
    if (this.ClientNameCtrl.value !== null) {
      this.searchProjectModule.clientId = this.ClientNameCtrl.value
    }
    if (this.StatusCtrl.value !== null) {
      this.searchProjectModule.Status = this.StatusCtrl.value
    }
    if (this.StartDate.value !== null) {
      this.searchProjectModule.fromDate = new Date(this.StartDate.value).toLocaleDateString();
    }
    if (this.Todate.value !== null) {
      this.searchProjectModule.toDate = new Date(this.Todate.value).toLocaleDateString();
    }
    this.searchProjectModule.pageSize = 0;
    this.searchProjectModule.page = 0;
    this._projectModuleService.searchProjectModule(this.searchTerm$, this.searchProjectModule)
      .subscribe(res => {
        this.projectModuleList = res.data;
        if (this.projectModuleList == null) {
          this.status = "No Record Found"
        }
      }, error => { console.log(error) });
  }
  // Search Milestone END

  // Delete Milestone START
  deleteProjectModule(id: number) {
    this._projectModuleService.deleteProjectModule(id).subscribe(data => {
      this._projectModuleService.getProjectModule().subscribe(res => {
        this.projectModuleList = res.data;
      });
    });
  }
  // Delete Milestone END




  //sortData START
  nameCss: any
  clientNameCss: any
  projectNameCss: any
  hourCss: any
  statusCss: any
  startDateCss: any
  endDateCss: any
  modifiedDateCss: any


  cleanCssClass() {
    this.nameCss = '';
    this.clientNameCss = '';
    this.projectNameCss = '';
    this.hourCss = '';
    this.startDateCss = '';
    this.endDateCss = '';
    this.modifiedDateCss = '';
    this.statusCss = '';
  }


  sort(sortBy: any) {
    this.cleanCssClass();
    const str = this.searchProjectModule.columnName
    if (str !== sortBy) {
      this.searchProjectModule.order = 'DESC'
      this.searchProjectModule.columnName = sortBy;
      this.searchProjectModule.order = this.searchProjectModule.order === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.searchProjectModule.columnName = sortBy;
      this.searchProjectModule.order = this.searchProjectModule.order === 'ASC' ? 'DESC' : 'ASC';
    }
    switch (sortBy) {
      case 'ModuleName': this.nameCss = this.searchProjectModule.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'ClientName': this.clientNameCss = this.searchProjectModule.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'ProjectName': this.projectNameCss = this.searchProjectModule.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'Hour': this.hourCss = this.searchProjectModule.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'Status': this.statusCss = this.searchProjectModule.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'StartDate': this.startDateCss = this.searchProjectModule.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'EndDate': this.endDateCss = this.searchProjectModule.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'ModifiedDate': this.modifiedDateCss = this.searchProjectModule.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;

      default: break;
    }
    this._projectModuleService.searchEntries(this.searchProjectModule)
      .subscribe(res => {
        this.projectModuleList = res.data;
      });
  }

  // sortData END

  // update data
  updateProjectModule(id: number) {
    this.dialog.open(ProjectmoduleComponent, { data: { id: id } });
  }
  // update data END


  // Reset Filter START

  reset() {

    this.searchProjectModuleForm.controls['Keyword'].reset();
    this.searchProjectModuleForm.controls['Keyword'].setValue('');
    this.searchProjectModule.keyWord = '';

    this.StartDate.reset();

    this.Todate.reset();
    this.searchProjectModule.fromDate = ''


    this.searchProjectModule.toDate = ''

    this.ProjectNameCtrl.reset();
    this.ProjectNameCtrl.setValue(0);
    this.searchProjectModule.projectId = 0

    this.ClientNameCtrl.reset();
    this.ClientNameCtrl.setValue(0);
    this.searchProjectModule.clientId = 0

    this.StatusCtrl.reset();
    this.StatusCtrl.setValue(0);
    this.searchProjectModule.Status = 0

    this._projectModuleService.refreshNeeded$
      .subscribe(() => {
        this.getAllProjectModuleList();
      });
    this._projectModuleService.getProjectName().subscribe(res => {
      this.projectName = res.data;

      this.filteredProjects.next(this.projectName.slice());
    });
    this.getAllProjectModuleList();
  }
  // Reset Filter ENDx


  // Open Popup Employee Componant
  onCreate() {
    this.dialog.open(ProjectmoduleComponent, { data: { id: 0 } });
  }

}
