import { Component, OnInit, ViewChild } from '@angular/core';
import { Client, Searchclient } from 'app/models/client';
import { ClientService } from 'app/services/clientservice.service';
import { MatDialog } from '@angular/material';
import { ClientComponent } from 'app/client/client.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Globals } from 'app/services/globalfile';



@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {

  nameCSS: any
  companyNameCSS: any
  emailIdCSS: any
  alternateEmailIdCSS: any
  contactNo1CSS: any
  contactNo2CSS: any
  addressCSS: any
  startDateCSS: any

  keyword: FormControl = new FormControl();
  pageSizeCtrl: FormControl = new FormControl();
  FromDate: FormControl = new FormControl();
  ToDate: FormControl = new FormControl();
  RoleName = ''
  startindex = 0;
  endindex = 2
  len: number;
  pageSize = 10;
  clientForm = new FormGroup
  ({
    pageSize: new FormControl(''),
    
  });


  clientList: Client[];
  searchTerm$ = new Subject<string>();
  status=''
  public popoverTitle = 'Delete Client';
  public popoverMessage = 'Are You Sure You Want To Delete Client?';
  public confirmClicked = false;
  public cancelClicked = false;
  constructor(private _clientService: ClientService, private dialog: MatDialog,private globals:Globals) { }

  searchClient = new Searchclient();

  searchClients() {
    this.searchClient.keyword = this.keyword.value;
    
    if (this.FromDate.value !== null) {
      this.searchClient.fromDate = new Date(this.FromDate.value).toLocaleDateString();
    }
    if (this.ToDate.value !== null) {
      this.searchClient.toDate = new Date(this.ToDate.value).toLocaleDateString(); 
    }

    this._clientService.searchClient(this.searchTerm$, this.searchClient)
      .subscribe(res => {
        this.clientList = res.data;
        if(this.clientList==null)
        {
          this.status="No Record Found"
        }
      });
  }
  ngOnInit() {
    this.RoleName=this.globals.RoleName()
    // Display
    this._clientService.refreshNeeded$
      .subscribe(() => {
        this.getAllClientList();
      });
    this.getAllClientList();
  }

  private getAllClientList() {
    this.status="Loading...."
    this._clientService.getClient().subscribe(res => {
      this.clientList = res.data;
      if(this.clientList==null)
      {
         this.status="No Record Found"
      }
    });
  }

    // Pagination START


  pageSizeDD() {
   this.pageSize = this.pageSizeCtrl.value;
  }
  // Pagination END

  cleanCssClass() {
  this.nameCSS = ''
  this.companyNameCSS = ''
  this.emailIdCSS = ''
  this.alternateEmailIdCSS = ''
  this.contactNo1CSS = ''
  this.contactNo2CSS = ''
  this.addressCSS = ''
  this.startDateCSS = ''

}
// Sort Data
  sort(sortBy: any) {
  this.cleanCssClass();
  const str = this.searchClient.columnName
  if ( str !== sortBy) {
    this.searchClient.order = 'DESC'
    this.searchClient.columnName = sortBy;
    this.searchClient.order = this.searchClient.order === 'ASC' ? 'DESC' : 'ASC' ;
  } else  {
    this.searchClient.columnName = sortBy;
    this.searchClient.order = this.searchClient.order === 'ASC' ? 'DESC' : 'ASC' ;
  }
  switch (sortBy) {
    case 'Name': this.nameCSS = this.searchClient.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'CompanyName': this.companyNameCSS = this.searchClient.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'EmailId': this.emailIdCSS = this.searchClient.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'AlternateEmailId': this.alternateEmailIdCSS = this.searchClient.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'ContactNo1': this.contactNo1CSS = this.searchClient.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'ContactNo2': this.contactNo2CSS = this.searchClient.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'Address': this.addressCSS = this.searchClient.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;
    case 'StartDate': this.startDateCSS = this.searchClient.order === 'DESC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up'; break;

    default: break;
  }

  this._clientService.searchEntries(this.searchClient)
      .subscribe(res => {
        this.clientList = res.data;
      });
}

  // Delete Data
  deleteClient(id: number) {
    this._clientService.deleteClient(id).subscribe(data => {
      this._clientService.getClient().subscribe(res => {
        this.clientList = res.data;
      });
    });
  }

  // Update Data
  updateClient(id: number) {
  this.dialog.open(ClientComponent, { data: { id: id } });
  }

   // Open Popup Employee Componant
  onCreate() {
    this.dialog.open(ClientComponent, { data: { id: 0 } });
  }

  reset() {
    this.keyword.reset();
    this.ToDate.reset();
    this.FromDate.reset();
    
    this.clientForm.controls['pageSize'].reset();
     this._clientService.refreshNeeded$
     .subscribe(() => {
       this.getAllClientList();
     });
   this.getAllClientLists();
 }

 private getAllClientLists() {
   this._clientService.getClient().subscribe(res => {
     this.clientList = res.data;
  
   });
 }
  }


