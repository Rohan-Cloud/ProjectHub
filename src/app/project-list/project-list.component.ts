import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSelect, PageEvent } from '@angular/material';
import { ProjectComponent } from 'app/project/project.component';
import { Project, Searchproject } from 'app/models/project';
import { ProjectService } from 'app/services/projectservice.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Globals } from 'app/services/globalfile';

interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  projectNameCSS: any
  clientNameCSS: any
  projectTypeCSS: any
  startDateCSS: any
  closerDateCSS: any
  isinternalprojectCSS: any
  billingHoursCSS: any
  projectManagerCSS: any
  modifiedByCSS: any
  RoleName = ''
  pageSize: number = 10;
  status = ''
  keyword: FormControl = new FormControl();
  projectTypeCtrl: FormControl = new FormControl(0);
  projectTypeFilterCtrl: FormControl = new FormControl();
  projectManagerCtrl: FormControl = new FormControl(0);
  projectManagerFilterCtrl: FormControl = new FormControl();
  clientNameCtrl: FormControl = new FormControl(0);
  clientNameFilterCtrl: FormControl = new FormControl();
  pageSizeCtrl: FormControl = new FormControl();

  projectList: Project[];
  searchTerm$ = new Subject<string>();

  private _onDestroy = new Subject<void>();

  public popoverTitle = 'Delete Project';
  public popoverMessage = 'Are You Sure You Want To Delete Project?';
  public confirmClicked = false;
  public cancelClicked = false;



  projectType: DropDown[];
  projectManager: DropDown[];
  ClientNameList: DropDown[];

  public filteredProjectTypes: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredProjectManagers: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredClientName: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  constructor(private dialog: MatDialog, private globals: Globals, private _projectService: ProjectService) { }

  searchProject = new Searchproject();
  searchProjects() {

    this.searchProject.keyword = this.keyword.value;
    if (this.projectTypeCtrl.value !== 0) {
      this.searchProject.projectType = this.projectTypeCtrl.value;
    }

    if (this.projectManagerCtrl.value !== 0) {
      this.searchProject.projectManager = this.projectManagerCtrl.value;
    }
    if (this.clientNameCtrl.value !== 0) {
      this.searchProject.Client = this.clientNameCtrl.value;
    }
    this._projectService.searchProject(this.searchTerm$, this.searchProject)
      .subscribe(res => {
        this.projectList = res.data;
        if (this.projectList == null) {
          this.status = "No Record Found"
        }
      });
  }

  ngOnInit() {
    this.RoleName = this.globals.RoleName()
    // Dropdown API Calling Technology
    this._projectService.getProjectProjectType().subscribe(res => {
      this.projectType = res.data;
      this.filteredProjectTypes.next(this.projectType.slice());
    });
    // Dropdown API Calling Technology
    this._projectService.getProjectProjectManager().subscribe(res => {
      this.projectManager = res.data;
      this.filteredProjectManagers.next(this.projectManager.slice());
    });
    this._projectService.getClientName().subscribe(res => {
      this.ClientNameList = res.data;
      this.filteredClientName.next(this.ClientNameList.slice());
    });

    // Value chnage in Dropdown
    this.projectTypeFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProjectType();
      });
    // Value chnage in Dropdown
    this.projectManagerFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProjectManager();
      });

    this.clientNameFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClientName();
      });

    // Display
    this._projectService.refreshNeeded$.subscribe(() => {
      this.getAllProjectList();
    });
    this.getAllProjectList();
  }

  private getAllProjectList() {
    this.status = "Loading...."
    this._projectService.getProject().subscribe(res => {
      this.projectList = res.data;
      if (this.projectList == null) {
        this.status = "No Record Found"
      }
    });
  }

  ngAfterViewInit() { this.setInitialValue(); }
  ngOnDestroy() { this._onDestroy.next(); this._onDestroy.complete(); }

  private setInitialValue() {
    this.filteredProjectTypes
      .pipe(take(0), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
      });

    this.filteredProjectManagers
      .pipe(take(0), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
      });

    this.filteredClientName
      .pipe(take(0), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
      });
  }

  pageSizeDD() {
    this.pageSize = this.pageSizeCtrl.value;
  }

  public filterProjectType() {
    if (!this.projectType) {
      return;
    }
    // get the search keyword
    let search = this.projectTypeFilterCtrl.value;
    if (!search) {
      this.filteredProjectTypes.next(this.projectType.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredProjectTypes.next(
      this.projectType.filter(projecttype => projecttype.name.toLowerCase().indexOf(search) > -1)
    );
  }
  public filterProjectManager() {
    if (!this.projectManager) {
      return;
    }
    // get the search keyword
    let search = this.projectManagerFilterCtrl.value;
    if (!search) {
      this.filteredProjectManagers.next(this.projectManager.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredProjectManagers.next(
      this.projectManager.filter(projectmanager => projectmanager.name.toLowerCase().indexOf(search) > -1)
    );
  }

  public filterClientName() {
    if (!this.ClientNameList) {
      return;
    }
    // get the search keyword
    let search = this.projectManagerFilterCtrl.value;
    if (!search) {
      this.filteredClientName.next(this.ClientNameList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredProjectManagers.next(
      this.ClientNameList.filter(clientName => clientName.name.toLowerCase().indexOf(search) > -1)
    );
  }
  cleanCssClass() {
    this.projectNameCSS = '';
    this.clientNameCSS = '';
    this.projectTypeCSS = '';
    this.startDateCSS = '';
    this.closerDateCSS = '';
    this.isinternalprojectCSS = '';
    this.billingHoursCSS = '';
    this.projectManagerCSS = '';
    this.modifiedByCSS = '';
  }

  // Sort Data
  sort(sortBy: any) {
    this.cleanCssClass();
    const str = this.searchProject.columnName
    if (str !== sortBy) {
      this.searchProject.order = 'DESC'
      this.searchProject.columnName = sortBy;
      this.searchProject.order = this.searchProject.order === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.searchProject.columnName = sortBy;
      this.searchProject.order = this.searchProject.order === 'ASC' ? 'DESC' : 'ASC';
    }
    switch (sortBy) {
      case 'ProjectName': this.projectNameCSS = this.searchProject.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'ClientName': this.clientNameCSS = this.searchProject.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'ProjectType': this.projectTypeCSS = this.searchProject.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'projectStartDate': this.startDateCSS = this.searchProject.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'projectClosureDate': this.closerDateCSS = this.searchProject.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'Isinternalproject': this.isinternalprojectCSS =
        this.searchProject.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'BillingHours': this.billingHoursCSS = this.searchProject.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'projectManagerName': this.projectManagerCSS =
        this.searchProject.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'ModifiedBy': this.modifiedByCSS = this.searchProject.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;

      default: break;
    }
    this._projectService.searchEntries(this.searchProject)
      .subscribe(res => {
        this.projectList = res.data;
      });
  }
  // Delete Data
  deleteProject(id: number) {
    this._projectService.deleteProject(id).subscribe(data => {
      this._projectService.getProject().subscribe(res => {
        this.projectList = res.data;

      });
    });
  }

  // Update Data
  updateProject(id: number) {
    this.dialog.open(ProjectComponent, { data: { id: id } });
  }

  // Open Popup Project Componant
  onCreate() {
    this.dialog.open(ProjectComponent, { data: { id: 0 } });
  }
  reset() {
    this.keyword.reset();
    this.searchProject.keyword = '';

    this.projectTypeCtrl.reset();
    this.projectTypeCtrl.setValue(0);
    this.searchProject.projectType = 0;

    this.projectManagerCtrl.reset();
    this.projectManagerCtrl.setValue(0);
    this.searchProject.projectManager = 0;

    this.clientNameCtrl.reset();
    this.clientNameCtrl.setValue(0);
    this.searchProject.Client = 0;

    this._projectService.refreshNeeded$.subscribe(() => {
      this.getAllProjectList();
    });
    this.getAllProjectLists();
  }
  private getAllProjectLists() {
    this._projectService.getProject().subscribe(res => {
      this.projectList = res.data;
    });
  }
}
