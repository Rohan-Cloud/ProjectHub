import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ForgotPasswordService } from 'app/services/ForgotPassword.service';
import { Router } from '@angular/router';
import { Adminlogin } from 'app/models/adminlogin';
import { SharedModule } from 'app/shared/shared.module';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  submitted = false;
  emailPattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  message:any

  constructor(private router: Router,private spinner: NgxSpinnerService, private _forgotPassword:ForgotPasswordService,private sharedModule: SharedModule) { }
  
  ForgotPasswordForm = new FormGroup
  ({
    EmailId: new FormControl('', [Validators.required,Validators.pattern(this.emailPattern)]),  
  });

  ngOnInit() {}

  
  get primaryEmail() {
    return this.ForgotPasswordForm.get('EmailId');
  } 

  onSubmit()
  {
    this.submitted = true;
    const adminlogin = new Adminlogin;
    adminlogin.Email = this.ForgotPasswordForm.controls["EmailId"].value
    this.spinner.show();
    this._forgotPassword.checkEmail(adminlogin).subscribe(res => {
        this.message = res.data;
        if (res.status == true) {
          this.spinner.hide();  
          localStorage.setItem('EmailID', res.data[0].email);
          localStorage.setItem('userId', res.data[0].userId);
          this.sharedModule.alertNotification('We have e-mailed your password reset link!...!', 'success')
        }
        else {
          this.spinner.hide();  
          console.log('Error Status Code: ' + res.status);
          this.sharedModule.alertNotification('Incorrect Email.', 'danger');
        }
      },error=>{ this.spinner.hide();this.sharedModule.alertNotification(' something went wrong.', 'danger');}
    )
  }
}
