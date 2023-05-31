import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'app/services/employeeservice.service';
import { Employee } from 'app/models/employee';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { Globals } from 'app/services/globalfile';
declare var $: any;
interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  submitted = false;
  Technology: DropDown[];
  Location: DropDown[];
  Role: DropDown[];
  employeeName: DropDown[];
  Status: DropDown[];
  employeeHeader = ''
  employee: Employee;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  JoiningDate: FormControl =  new FormControl();
  DateofBirth: FormControl =  new FormControl();
  employeeForm = new FormGroup
    ({
      Name: new FormControl('', [Validators.required]),
      Title: new FormControl('', [Validators.required]),
      EmailId: new FormControl('', [Validators.required,Validators.pattern(this.emailPattern)]),
      MobileNo: new FormControl('', [Validators.required]),
      Technology: new FormControl('', [Validators.required]),
      Location: new FormControl('', [Validators.required]),
      Status: new FormControl('', [Validators.required]),
      ReportingAuthority: new FormControl('', [Validators.required]),
      Role: new FormControl('', [Validators.required]),
     
    });

  constructor(private _employeeService: EmployeeService, private globals: Globals,
     @Inject(MAT_DIALOG_DATA) public Data: any, private sharedModule: SharedModule, private dialogRef: MatDialog) { }

  ngOnInit() {
    this._employeeService.getEmployeeTechnology().subscribe(res => {
      this.Technology = res.data;
    });

    this._employeeService.getEmployeeLocation().subscribe(res => {
      this.Location = res.data;
    });

    this._employeeService.getEmployeeRole().subscribe(res => {
      this.Role = res.data;
    });

    this._employeeService.getEmployeeName().subscribe(res => {
      this.employeeName = res.data;
    });
    this._employeeService.getEmployeeStatus().subscribe(res => {
      this.Status = res.data;
    });

    this.employeeHeader = 'Add Employee'
    if (this.Data.id !== 0) {  // Set Value In Form Control Using Update Button
      this.employeeHeader = 'Update Employee'
      this._employeeService.getEmployeeById(this.Data.id).subscribe(res => {

        this.employeeForm.controls['Name'].setValue(res.data[0].name);
        this.employeeForm.controls['Title'].setValue(res.data[0].title);
        this.employeeForm.controls['EmailId'].setValue(res.data[0].emailId);
        this.employeeForm.controls['MobileNo'].setValue(res.data[0].mobileNo);
        this.employeeForm.controls['Technology'].setValue(res.data[0].technology)
        this.employeeForm.controls['Location'].setValue(res.data[0].location);
        this.employeeForm.controls['Status'].setValue(res.data[0].status);
        this.employeeForm.controls['ReportingAuthority'].setValue(res.data[0].reportingAuthority);
        this.employeeForm.controls['Role'].setValue(res.data[0].role);
        if(res.data[0].joiningDate != '1900-01-01T00:00:00' && res.data[0].joiningDate != '0001-01-01T00:00:00')
          this.JoiningDate.setValue(res.data[0].joiningDate);
        if(res.data[0].dateOfBirth != '1900-01-01T00:00:00' && res.data[0].dateOfBirth != '0001-01-01T00:00:00')
          this.DateofBirth.setValue(res.data[0].dateOfBirth);
      })
    }
  }

  get f() { return this.employeeForm.controls; }// For Validation
 
  alphabate(event: any) {
   
      const pattern = /[a-zA-Z\ ]/;
      const inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode !== 8 && !pattern.test(inputChar)) {
          event.preventDefault();
        }
      }
      mobileNo(event: any) {
        const pattern = /[0-9\+\-\ ]/;
          const inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode !== 8 && !pattern.test(inputChar)) {
              event.preventDefault();
            }
          }

  onSubmit() {
    this.submitted = true;
    if (this.employeeForm.invalid) {
      return false;
    }
    const employee = new Employee();
    
    employee.name = this.employeeForm.controls['Name'].value,
    employee.title = this.employeeForm.controls['Title'].value,
    employee.emailId = this.employeeForm.controls['EmailId'].value,
    employee.mobileNo = this.employeeForm.controls['MobileNo'].value,
    employee.technology = this.employeeForm.controls['Technology'].value;
    employee.location = this.employeeForm.controls['Location'].value;
    employee.status = this.employeeForm.controls['Status'].value;
    employee.reportingAuthority = this.employeeForm.controls['ReportingAuthority'].value;
    employee.role = this.employeeForm.controls['Role'].value;
    employee.joiningDate = new Date(this.JoiningDate.value).toLocaleDateString(); 
    employee.dateofBirth = new Date(this.DateofBirth.value).toLocaleDateString(); 

    if (this.Data.id !== 0) {
      //  Update Data
      this._employeeService.updateEmployee(this.Data.id, employee).subscribe(res => {
        this.employee = res.data;
        if (res.status) {
          this.sharedModule.alertNotification(res.message, 'success');
        }
      })
      this.dialogRef.closeAll();
    } else { // Add Data

      employee.companyId = this.globals.companyId()
      this._employeeService.addEmployee(employee).subscribe(res => {
        this.employee = res.data;
        if (res.status) {
          this.sharedModule.alertNotification(res.message, 'success');
        }
      })
      this.dialogRef.closeAll();
    }
  }
}
