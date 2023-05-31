import { Component, OnInit } from '@angular/core';
import { ClientService } from 'app/services/clientservice.service';
import { Client } from 'app/models/client';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { Globals } from 'app/services/globalfile';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  submitted = false;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  mobilenopattern = '^[+0-9]{3}[0-9]{3}[0-9]{6}$';
  client: Client;
  clientHeader= ''
  StartDate: FormControl = new FormControl();
  clientForm = new FormGroup
    ({
      Name: new FormControl('', [Validators.required]),
      CompanyName: new FormControl('', [Validators.required]),
      EmailId: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      AlternateEmailId: new FormControl('', [ Validators.pattern(this.emailPattern)]),
      ContactNo1: new FormControl('', [Validators.required]),
      ContactNo2: new FormControl(''),
      Address: new FormControl('', [Validators.required]),
     
    });

  constructor(private _clientService: ClientService,private globals:Globals, private dialogRef: MatDialog,
     private sharedModule: SharedModule, @Inject(MAT_DIALOG_DATA) public Data: any) { }

  ngOnInit() {
    this.clientHeader="Add Client"
    if (this.Data.id !== 0) {  // Set Value In Form Control Using Update Button
      this.clientHeader="Update Client"
      this._clientService.getClientById(this.Data.id).subscribe(res => {
        this.clientForm.controls['Name'].setValue(res.data[0].name);
        this.clientForm.controls['CompanyName'].setValue(res.data[0].companyName);
        this.clientForm.controls['EmailId'].setValue(res.data[0].emailId)
        this.clientForm.controls['AlternateEmailId'].setValue(res.data[0].alternateEmailId);
        this.clientForm.controls['ContactNo1'].setValue(res.data[0].contactNo1);
        this.clientForm.controls['ContactNo2'].setValue(res.data[0].contactNo2);
        this.clientForm.controls['Address'].setValue(res.data[0].address);
        this.StartDate.setValue(res.data[0].startDate);
      })
    }
  }
    get f() { return this.clientForm.controls; }// For Validation
    get primaryEmail() {
      return this.clientForm.get('EmailId');

    }
     alphabate(event: any) {
        // evt = (evt) ? evt : window.event;
        // const charCode = (evt.which) ? evt.which : evt.keyCode;
        //   if (charCode > 31 && (charCode !== 32 && (charCode < 97 || charCode > 122 ) && (charCode < 65 || charCode > 90 ))) {
        //     return false;
        //       } else {
        //         return true;
        //     }
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
      if (this.clientForm.invalid){
        return false;
      }
      const client = new Client();
      client.name = this.clientForm.controls['Name'].value,
      client.companyName = this.clientForm.controls['CompanyName'].value,
      client.emailId = this.clientForm.controls['EmailId'].value;
      client.alternateEmailId = this.clientForm.controls['AlternateEmailId'].value;
      client.contactNo1 = this.clientForm.controls['ContactNo1'].value;
      client.contactNo2 = this.clientForm.controls['ContactNo2'].value;
      client.address = this.clientForm.controls['Address'].value;
      client.startDate =  new Date(this.StartDate.value).toLocaleDateString();
      client.companyId=this.globals.companyId()
      if (this.Data.id !== 0) { //  Update Data
        this._clientService.updateClient(this.Data.id, client).subscribe(res => {
          this.client = res.data;
          if (res.status) {
            this.sharedModule.alertNotification(res.message, 'success');
          }
        })
        this.dialogRef.closeAll();
      } else { // Add Data
        this._clientService.addClient(client).subscribe(res => {
          this.client = res.data;
           if (res.status) {
            this.sharedModule.alertNotification(res.message, 'success');
           }
        })
        this.dialogRef.closeAll();
      }
    }
  }
