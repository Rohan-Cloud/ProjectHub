import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'app/services/employeeservice.service';
import { Employee, Searchemployee } from 'app/models/employee';
import { MatDialog, MatSelect } from '@angular/material';
import { EmployeeComponent } from 'app/employee/employee.component';
import { FormControl } from '@angular/forms';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { UserMasterCredentialComponent } from 'app/user-master-credential/user-master-credential.component';
import { Globals } from 'app/services/globalfile';


interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})

export class EmployeeListComponent implements OnInit {

  p: any
  nameCSS: any
  titleCSS: any
  technologyNameCSS: any
  locationNameCSS: any
  statusNameCSS: any
  reportingAuthorityCSS: any
  roleNameCSS: any
  updatedDateCSS: any

  keyword: FormControl = new FormControl();
  technologyCtrl: FormControl = new FormControl();
  technologyFilterCtrl: FormControl = new FormControl();
  locationCtrl: FormControl = new FormControl();
  locationFilterCtrl: FormControl = new FormControl();
  statusCtrl: FormControl = new FormControl();
  statusFilterCtrl: FormControl = new FormControl();
  roleCtrl: FormControl = new FormControl();
  roleFilterCtrl: FormControl = new FormControl();
  pageSizeCtrl: FormControl = new FormControl();

  startindex = 0;
  endindex = 2
  len: number;
  pageSize = 10;

  employeeList: Employee[];
  searchTerm$ = new Subject<string>();

  private _onDestroy = new Subject<void>();

  public popoverTitle = 'Delete Employee';
  public popoverMessage = 'Are You Sure You Want To Delete Employee?';
  public confirmClicked = false;
  public cancelClicked = false;

  startedClass = false;
  completedClass = false;
  preventAbuse = false;

  Technology: DropDown[];
  Location: DropDown[];
  Status: DropDown[];
  Role: DropDown[];

  public filteredTechnologys: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredLocations: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredStatus: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  public filteredRoles: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  RoleName = ''
  status = ''
  constructor(private _employeeService: EmployeeService, private dialog: MatDialog, private globals: Globals) { }
  searchEmployee = new Searchemployee();
  searchEmployees() {
    this.searchEmployee.keyword = this.keyword.value;
    if (this.technologyCtrl.value !== null) {
      this.searchEmployee.technology = this.technologyCtrl.value;
    }
    if (this.locationCtrl.value !== null) {
      this.searchEmployee.location = this.locationCtrl.value;
    }
    if (this.statusCtrl.value !== null) {
      this.searchEmployee.status = this.statusCtrl.value;
    }
    if (this.roleCtrl.value !== null) {
      this.searchEmployee.role = this.roleCtrl.value;
    }
    this._employeeService.searchEmployee(this.searchTerm$, this.searchEmployee)
      .subscribe(res => {
        this.employeeList = res.data;
        if (this.employeeList == null) {
          this.status = "No Record Found"
        }
      });
  }

  ngOnInit() {


    // Dropdown API Calling Technology
    this.RoleName = this.globals.RoleName()
    this._employeeService.getEmployeeTechnology().subscribe(res => {
      this.Technology = res.data;
      this.filteredTechnologys.next(this.Technology.slice());
    });
    // Dropdown API Calling Location
    this._employeeService.getEmployeeLocation().subscribe(res => {
      this.Location = res.data;
      this.filteredLocations.next(this.Location.slice());
    });
    // Dropdown API Calling Status
    this._employeeService.getEmployeeStatus().subscribe(res => {
      this.Status = res.data;
      this.filteredStatus.next(this.Status.slice());
    });
    // Dropdown API Calling Technology
    this._employeeService.getEmployeeRole().subscribe(res => {
      this.Role = res.data;
      this.filteredRoles.next(this.Role.slice());
    });

    // Value chnage in Dropdown
    this.technologyFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTechnology();
      });
    // Value chnage in Dropdown
    this.locationFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterLocation();
      });
    // Value chnage in Dropdown
    this.statusFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStatus();
      });
    // Value chnage in Dropdown
    this.roleFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterRole();
      });

    // Display

    this._employeeService.refreshNeeded$
      .subscribe(() => {
        this.getAllEmployeeList();
      });
    this.getAllEmployeeList();
  }

  private getAllEmployeeList() {
    this.status = "Loading...."

    this._employeeService.getEmployee().subscribe(res => {
      this.employeeList = res.data;
      if (this.employeeList == null) {
        this.status = "No Record Found"
      }
    });
  }
  onStarted() {
    this.startedClass = true;
    setTimeout(() => {
      this.startedClass = false;
    }, 800);
  }

  onCompleted() {
    this.completedClass = true;
    setTimeout(() => {
      this.completedClass = false;
    }, 800);
  }
  ngAfterViewInit() { this.setInitialValue(); }
  ngOnDestroy() { this._onDestroy.next(); this._onDestroy.complete(); }

  private setInitialValue() {
    this.filteredTechnologys
      .pipe(take(0), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
      });

    this.filteredLocations
      .pipe(take(0), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
      });

    this.filteredStatus
      .pipe(take(0), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
      });

    this.filteredRoles
      .pipe(take(0), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
      });
  }

  public filterTechnology() {
    if (!this.Technology) {
      return;
    }
    // get the search keyword
    let search = this.technologyFilterCtrl.value;
    if (!search) {
      this.filteredTechnologys.next(this.Technology.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredTechnologys.next(
      this.Technology.filter(technology => technology.name.toLowerCase().indexOf(search) > -1)
    );
  }

  public filterLocation() {
    if (!this.Location) {
      return;
    }
    // get the search keyword
    let search = this.locationFilterCtrl.value;
    if (!search) {
      this.filteredLocations.next(this.Location.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredLocations.next(
      this.Location.filter(location => location.name.toLowerCase().indexOf(search) > -1)
    );
  }

  public filterStatus() {
    if (!this.Status) {
      return;
    }
    // get the search keyword
    let search = this.statusFilterCtrl.value;
    if (!search) {
      this.filteredStatus.next(this.Status.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredStatus.next(
      this.Location.filter(status => status.name.toLowerCase().indexOf(search) > -1)
    );
  }

  public filterRole() {
    if (!this.Role) {
      return;
    }
    // get the search keyword
    let search = this.roleFilterCtrl.value;
    if (!search) {
      this.filteredRoles.next(this.Role.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredRoles.next(
      this.Role.filter(role => role.name.toLowerCase().indexOf(search) > -1)
    );
  }

  // Pagination START
  pageSizeDD() {
    this.pageSize = this.pageSizeCtrl.value;
  }
  // Pagination END

  cleanCssClass() {
    this.nameCSS = ''
    this.titleCSS = ''
    this.technologyNameCSS = ''
    this.locationNameCSS = ''
    this.statusNameCSS = ''
    this.reportingAuthorityCSS = ''
    this.roleNameCSS = ''
    this.updatedDateCSS = ''
    // this.joiningDate ='';
    // this.dateofBirth = '';

  }
  // Sort Data
  sort(sortBy: any) {
    this.cleanCssClass();
    const str = this.searchEmployee.columnName
    if (str !== sortBy) {
      this.searchEmployee.order = 'DESC'
      this.searchEmployee.columnName = sortBy;
      this.searchEmployee.order = this.searchEmployee.order === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.searchEmployee.columnName = sortBy;
      this.searchEmployee.order = this.searchEmployee.order === 'ASC' ? 'DESC' : 'ASC';
    }
    switch (sortBy) {
      case 'Name': this.nameCSS = this.searchEmployee.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'Title': this.titleCSS = this.searchEmployee.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'TechnologyName': this.technologyNameCSS = this.searchEmployee.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'LocationName': this.locationNameCSS = this.searchEmployee.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'StatusName': this.statusNameCSS = this.searchEmployee.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'reportingAuthorityName': this.reportingAuthorityCSS =
        this.searchEmployee.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'RoleName': this.roleNameCSS = this.searchEmployee.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      case 'UpdatedDate': this.updatedDateCSS = this.searchEmployee.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      // case 'JoiningDate': this.joiningDateCSS = this.searchEmployee.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
      // case 'DateofBirth': this.dateofBirthCSS = this.searchEmployee.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;

      default: break;
    }

    this._employeeService.searchEntries(this.searchEmployee)
      .subscribe(res => {
        this.employeeList = res.data;
      });
  }


  // Delete Data
  deleteEmployee(id: number) {
    this._employeeService.deleteEmployee(id).subscribe(data => {
      this._employeeService.getEmployee().subscribe(res => {
        this.employeeList = res.data;
      });
    });
  }

  // Update Data
  updateEmployee(id: number) {
    this.dialog.open(EmployeeComponent, { data: { id: id } });
  }

  // Open Popup Employee Componant
  onCreate() {
    this.dialog.open(EmployeeComponent, { data: { id: 0 } });
  }
  InsertCredential(id: number) {
    this.dialog.open(UserMasterCredentialComponent, { data: { id: id } });
  }
  reset() {
    this.keyword.reset();
    this.searchEmployee.keyword = " "
    this.technologyCtrl.reset();
    this.technologyCtrl.setValue(0);
    this.searchEmployee.technology = 0
    this.locationCtrl.reset();
    this.locationCtrl.setValue(0);
    this.searchEmployee.location = 0

    this.statusCtrl.reset();
    this.statusCtrl.setValue(0);
    this.searchEmployee.status = 0

    this.roleCtrl.reset();
    this.roleCtrl.setValue(0);
    this.searchEmployee.role = 0

    this._employeeService.refreshNeeded$
      .subscribe(() => {
        this.getAllEmployeeList();
      });
    this.getAllEmployeeLists();
  }
  private getAllEmployeeLists() {

    this._employeeService.getEmployee().subscribe(res => {
      this.employeeList = res.data;
    });

  }
}
