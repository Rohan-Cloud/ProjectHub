import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { EmployeeService } from 'app/services/employeeservice.service';
import { UserMasterService } from 'app/services/usermaster.service';
import { UserMaster } from 'app/models/usermaster';
import { adminloginService } from 'app/services/adminlogin.service';
import { Globals } from 'app/services/globalfile';
interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-user-master-credential',
  templateUrl: './user-master-credential.component.html',
  styleUrls: ['./user-master-credential.component.scss']
})
export class UserMasterCredentialComponent implements OnInit {

  usermaster = new UserMaster()
  Header: string = " "

  CompanyName: DropDown[];
  UserMasterCredential = new FormGroup
    ({
      UserName: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required]),
      Companyname: new FormControl('', [Validators.required]),
    });
  constructor(private _employeeService: EmployeeService, private globals: Globals, private _adminloginService: adminloginService, private _userMasterService: UserMasterService, @Inject(MAT_DIALOG_DATA) public data: any, private sharedModule: SharedModule, private dialogRef: MatDialog) { }

  ngOnInit() {
    this._adminloginService.getEmployeeCompany().subscribe(res => {
      this.CompanyName = res.data;
    });
    if (this.data.id > 0) {
      this._userMasterService.getUserMasterByEmployeeId(this.data.id).subscribe(res => {
        if (res.data.length > 0) {
          this.Header = "Update Credentials"
          this._employeeService.getEmployeeById(this.data.id).subscribe(res => {
            var yearstr = res.data[0].name.split(' ');
            this.usermaster.FirstName = yearstr[0]
            this.usermaster.LastName = yearstr[1]
            this.usermaster.EmailId = res.data[0].emailId
            this.usermaster.UserTypeId = parseInt(res.data[0].role)
          })

          this.UserMasterCredential.controls["UserName"].setValue(res.data[0].userName)
          this.UserMasterCredential.controls["Password"].setValue(res.data[0].password)
          this.usermaster.Status = res.data[0].status
          this.usermaster.UserTypeId = res.data[0].userTypeId
          this.usermaster.profilePicture = res.data[0].profilePicture
          this.usermaster.RecruiterId = res.data[0].recruiterId
          this.usermaster.ResetId = res.data[0].resetId
          this.usermaster.ModifiedBy = this.globals.UserId()
          this.usermaster.EmployeeId = res.data[0].employeeId
        }
        else {
          this.Header = "Add Credentials"
          this._employeeService.getEmployeeById(this.data.id).subscribe(res => {
            var yearstr = res.data[0].name.split(' ');
            this.usermaster.FirstName = yearstr[0]
            this.usermaster.LastName = yearstr[1]
            this.usermaster.EmailId = res.data[0].emailId
            this.usermaster.Status = 1
            this.usermaster.UserTypeId = res.data[0].role
            this.usermaster.profilePicture = null
            this.usermaster.RecruiterId = 0
            this.usermaster.ResetId = null
            this.usermaster.ModifiedBy = this.globals.UserId()
            this.usermaster.EmployeeId = this.data.id
          })
        }

      })
    }
  }
  onSubmit() {
    this.usermaster.UserName = this.UserMasterCredential.controls["UserName"].value;
    this.usermaster.Password = this.UserMasterCredential.controls["Password"].value;
    this.usermaster.CompanyId = this.globals.companyId();
    this._userMasterService.addupdateUserMaster(this.usermaster).subscribe(res => {
      if (res.status) {
        this.sharedModule.alertNotification(res.message, 'success');
      }
      this.dialogRef.closeAll();
    })
  }
}
