import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ForgotPasswordService } from 'app/services/ForgotPassword.service';
import { Adminlogin } from 'app/models/adminlogin';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {

  constructor(private router: Router, private spinner: NgxSpinnerService, private route: ActivatedRoute, private _forgotPassword: ForgotPasswordService, private sharedModule: SharedModule) { }
  submitted = false;
  adminlogin = new Adminlogin;
  Message: any

  ResetPasswordForm = new FormGroup
    ({
      NewPassword: new FormControl('', [Validators.required]),
      ConfirmPassword: new FormControl('', [Validators.required])

    });
  st: boolean
  checkPasswords() { // here we have the 'passwords' group
    let pass = this.ResetPasswordForm.get('NewPassword').value;
    let confirmPass = this.ResetPasswordForm.get('ConfirmPassword').value;
    this.st = pass === confirmPass ? false : true
    return pass === confirmPass ? false : true
  }
  ngOnInit() {
    this.spinner.show();
    this.adminlogin.resetid = this.route.snapshot.queryParamMap.get('d');

    this._forgotPassword.check(this.adminlogin).subscribe(res => {
      this.Message = res.Message;
      if (res.status != true) {
        this.sharedModule.alertNotification('This link is expire', 'danger');
        this.router.navigate(['login']);
        this.spinner.hide();
      }
    }, error => {
      this.sharedModule.alertNotification('somthing went wrong', 'danger');
      this.router.navigate(['login'])
    }
    )
    this.spinner.hide();
    // if(localStorage.getItem['EmailId']=='')
    // {
    //   this.router.navigate(['login']);
    // }
  }

  onSubmit() {
    this.submitted = true;
    this.adminlogin.Password = this.ResetPasswordForm.controls["NewPassword"].value
    this.adminlogin.Email = localStorage.getItem('EmailID');
    this.adminlogin.UserId = parseInt(localStorage.getItem('userId'));
    this._forgotPassword.Updatepassword(this.adminlogin).subscribe(res => {
      this.Message = res.Message;
      if (res.status == true) {
        this.sharedModule.alertNotification('Password reset successfully', 'success');
        this.router.navigate(['login']);
      }
      else {
        this.sharedModule.alertNotification('Incorrect Email', 'danger');
      }
    }, error => {
      this.sharedModule.alertNotification('somthing went wrong', 'danger');
      this.router.navigate(['login']);
    }
    )
  }
}
