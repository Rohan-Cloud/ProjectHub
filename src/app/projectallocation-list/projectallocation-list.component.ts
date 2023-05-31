import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSelect } from '@angular/material';
import { ProjectAllocationService } from 'app/services/projectallocatioservice.service';
import { ProjectallocationComponent } from 'app/projectallocation/projectallocation.component';
import { Projectallocation, Searchprojectallocation } from 'app/models/projectallocation';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { takeUntil, take } from 'rxjs/operators';
import { Globals } from 'app/services/globalfile';

interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-projectallocation-list',
  templateUrl: './projectallocation-list.component.html',
  styleUrls: ['./projectallocation-list.component.scss'],
})
export class ProjectallocationListComponent implements OnInit {

  projectNameCSS: any;
  employeeNameCSS: any;
  startDateCSS: any;
  endDateCSS: any;
  updatedDateCSS: any;

   projectNameCtrl: FormControl = new FormControl();
   projectNameFilterCtrl: FormControl = new FormControl();
   employeeNameCtrl: FormControl = new FormControl();
   employeeNameFilterCtrl: FormControl = new FormControl();
   statusCtrl: FormControl = new FormControl();
   statusFilterCtrl: FormControl = new FormControl();
   keyword: FormControl = new FormControl();
   pageSizeCtrl: FormControl = new FormControl();

   startindex = 0;
  endindex = 2
  len: number;
  pageSize = 10;

  projectAllocationList: Projectallocation[];
  searchTerm$ = new Subject<string>();

  private _onDestroy = new Subject<void>();

  public popoverTitle = 'Delete Project Allocation';
  public popoverMessage = 'Are You Sure You Want To Delete Project Allocation?';
  public confirmClicked = false;
  public cancelClicked = false;

  projectName: DropDown[];
  employeeName: DropDown[];
  statusName: DropDown[]
  status=''
  RoleName=''
  
  public filteredProjectNames: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredEmployeeNames: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredStatus: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  constructor(private globals : Globals,private _projectAllocationService: ProjectAllocationService, private dialog: MatDialog) { }
  searchprojectallocation = new Searchprojectallocation();
  searchProjectAllocation() {
    this.searchprojectallocation.keyword = this.keyword.value;

    if (this.projectNameCtrl.value !== null) {
      this.searchprojectallocation.projectId = this.projectNameCtrl.value;
    }
    if (this.employeeNameCtrl.value !== null) {
      this.searchprojectallocation.employeeId = this.employeeNameCtrl.value;
    }
    if (this.statusCtrl.value !== null) {
      this.searchprojectallocation.status = this.statusCtrl.value;
    }
    this._projectAllocationService.searchAllocation(this.searchTerm$, this.searchprojectallocation)
      .subscribe(res => {
        this.projectAllocationList = res.data;
          if(this.projectAllocationList == null)
          {
            this.status="No Record Found"
          }
      });
  }

  ngOnInit() {
    this.RoleName=this.globals.RoleName()

                // Dropdown API Calling Project Name
    this._projectAllocationService.getProjectAllocationProjectName().subscribe(res => {
      this.projectName = res.data;
      // this.ProjectNameCtrl.setValue(this.projectName);
      this.filteredProjectNames.next(this.projectName.slice());
    });
                // Dropdown API Calling Employee Name
    this._projectAllocationService.getProjectAllocationEmployeeName().subscribe(res => {
      this.employeeName = res.data;
      this.filteredEmployeeNames.next(this.employeeName.slice());
    });
                // Dropdown API Calling Status
     this._projectAllocationService.getProjectAllocationStatus().subscribe(res => {
      this.statusName = res.data;
      this.filteredStatus.next(this.statusName.slice());
    });

    // Value chnage in Dropdown
    this.statusFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterStatus();
    });

    // Value chnage in Dropdown
    this.projectNameFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProjectName();
      });

    // Value chnage in Dropdown
    this.employeeNameFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterEmployeeName();
      });

    // Display
    this._projectAllocationService.refreshNeeded$
      .subscribe(() => {
        this.getAllProjectAllocationList();
      });
    this.getAllProjectAllocationList();
  }
   getAllProjectAllocationList() {
    this.status="Loading...."

    this._projectAllocationService.getProjectAllocation().subscribe(res => {
      this.projectAllocationList = res.data;
     
      if(this.projectAllocationList == null)
        {
          this.status="No Record Found"
        }
    });
  }

  ngAfterViewInit() { this.setInitialValue(); }
  ngOnDestroy() { this._onDestroy.next(); this._onDestroy.complete(); }

   setInitialValue() {
    this.filteredProjectNames
      .pipe(take(0), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
      });

    this.filteredEmployeeNames
      .pipe(take(0), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
      });

    this.filteredStatus
    .pipe(take(0), takeUntil(this._onDestroy))
    .subscribe(() => {
      this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
    });
  }

    filterProjectName() {
    if (!this.projectName) {
      return;
    }
    // get the search keyword
    let search = this.projectNameFilterCtrl.value;
    if (!search) {
      this.filteredProjectNames.next(this.projectName.slice());
      return;
    }  else {
      search = search.toLowerCase();
    }
    this.filteredProjectNames.next(
      this.projectName.filter(projectname => projectname.name.toLowerCase().indexOf(search) > -1)
    );
  }

   filterEmployeeName() {
    if (!this.employeeName) {
      return;
    }
    // get the search keyword
    let search = this.employeeNameFilterCtrl.value;
    if (!search) {
      this.filteredEmployeeNames.next(this.employeeName.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the employee name
    this.filteredEmployeeNames.next(
      this.employeeName.filter(employeename => employeename.name.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterStatus() {
    if (!this.statusName) {
      return;
    }
    let search = this.statusFilterCtrl.value;
    if (!search) {
      this.filteredStatus.next(this.statusName.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStatus.next(
      this.statusName.filter(statusname => statusname.name.toLowerCase().indexOf(search) > -1)
    );
  }

  // Pagination START
  getLength() {
    if (this.len! = 0)    {
      return new Array(this.len + 1);
    }
  }

  pageSizeDD() {
   this.pageSize = this.pageSizeCtrl.value;
  }
  // Pagination END


   // Filter Project END
    cleanCssClass() {
    this.projectNameCSS = '';
    this.employeeNameCSS = '';
    this.startDateCSS = '';
    this.endDateCSS = '';
    this.updatedDateCSS = '';
  }
    // Sort Data
    sort(sortBy: any) {
    this.cleanCssClass();

    const str = this.searchprojectallocation.columnName
    if ( str !== sortBy) {
      this.searchprojectallocation.order = 'DESC'
      this.searchprojectallocation.columnName = sortBy;
      this.searchprojectallocation.order = this.searchprojectallocation.order === 'ASC' ? 'DESC' : 'ASC' ;
    } else {
      this.searchprojectallocation.columnName = sortBy;
      this.searchprojectallocation.order = this.searchprojectallocation.order === 'ASC' ? 'DESC' : 'ASC' ;
    }
    switch (sortBy) {
      case 'ProjectName': this.projectNameCSS =
            this.searchprojectallocation.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'EmployeeName': this.employeeNameCSS =
            this.searchprojectallocation.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'StartDate': this.startDateCSS =
             this.searchprojectallocation.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'EndDate': this.endDateCSS =
             this.searchprojectallocation.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'UpdatedDate': this.updatedDateCSS =
            this.searchprojectallocation.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      default: break;
    }
    this._projectAllocationService.searchEntries( this.searchprojectallocation)
      .subscribe(res => {
        this.projectAllocationList = res.data;
      });
  }

  // Delete Data
  deleteProjectAllocation(id: number) {
    this._projectAllocationService.deleteProjectAllocation(id).subscribe(data => {
      this._projectAllocationService.getProjectAllocation().subscribe(res => {
        this.projectAllocationList = res.data;
      });
    });
  }

  // Update Data
  updateProjectAllocation(id: number) {
    this.dialog.open(ProjectallocationComponent, { data: { id: id } });
  }

  // Open Popup ProjectAllocation Componant
  onCreate() {
    this.dialog.open(ProjectallocationComponent, { data: { id: 0 } })
  }

  reset() {
    this.keyword.reset();

     this.employeeNameCtrl.reset();
     this.employeeNameCtrl.setValue(0);

     this.projectNameCtrl.reset();
     this.projectNameCtrl.setValue(0);

     this.statusCtrl.reset();
     this.statusCtrl.setValue(0);

     this._projectAllocationService.refreshNeeded$
      .subscribe(() => {
        this.getAllProjectAllocationList();
      });
     this.getAllProjectAllocationLists();
  }
    getAllProjectAllocationLists() {
    this._projectAllocationService.getProjectAllocation().subscribe(res => {
    this.projectAllocationList = res.data;
    });
  }
  }


