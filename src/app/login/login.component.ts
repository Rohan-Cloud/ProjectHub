import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { adminloginService } from "app/services/adminlogin.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Adminlogin } from 'app/models/adminlogin';
import { SharedModule } from 'app/shared/shared.module';
import { NgxSpinnerService } from "ngx-spinner";
import { Globals } from 'app/services/globalfile'
interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']

})

export class LoginComponent implements OnInit {

  submitted = false;
  username: string;
  password: string;
  token: string;
  public name: string;
  public userId: string;
  emailId: string

  adminlogin: Adminlogin;
  CompanyName: DropDown[];
  adminLoginForm = new FormGroup
    ({
      UserName: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required]),
      Companyname: new FormControl('', [Validators.required]),
    });
  hide = true;
  constructor(private router: Router, private globals: Globals, private spinner: NgxSpinnerService, private _adminloginService: adminloginService, private sharedModule: SharedModule) { }

  ngOnInit() {
    this.spinner.hide();
    this._adminloginService.getEmployeeCompany().subscribe(res => {
      this.CompanyName = res.data;
    });
  }

  get f() { return this.adminLoginForm.controls; }

  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    const adminlogin = new Adminlogin;
    adminlogin.UserName = this.adminLoginForm.controls["UserName"].value
    adminlogin.Password = this.adminLoginForm.controls["Password"].value
    adminlogin.CompanyId = this.adminLoginForm.controls["Companyname"].value
    this.router.navigate(['admin/dashboard']);
    this._adminloginService.checkAdminCredential(adminlogin).subscribe(res => {

      if (res.status == true) {
        this.spinner.hide();
        this.token = res.token;
        this.userId = res.userdata[0].userId;
        this.emailId = res.userdata[0].email;
        this.username = res.userdata[0].firstName;
        this.globals.Email = this.emailId
        localStorage.setItem('profilephoto', res.userdata[0].profilePhoto);
        localStorage.setItem('token', this.token);
        localStorage.setItem('CompanyId', btoa(this.adminLoginForm.controls["Companyname"].value));
        localStorage.setItem('Name', this.username);

        this.sharedModule.alertNotification('Successfully Login...!', 'success');
        this.router.navigate(['admin/dashboard']);
      }
      else {
        this.spinner.hide();
        this.sharedModule.alertNotification('Incorrect Username And Password.', 'danger');
      }
    }, error => { this.spinner.hide(); }
    )
  }

  forgotPassword() {
    this.router.navigate(['forgotPassword']);
  }

} 
