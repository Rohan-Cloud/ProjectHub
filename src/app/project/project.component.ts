import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Project } from 'app/models/project';
import {  ProjectService } from 'app/services/projectservice.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatSelect, MatDatepickerInputEvent } from '@angular/material';
import { Inject } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DatePipe } from '@angular/common';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'environments/environment';
import {Globals} from 'app/services/globalfile'


interface DropDown {
  id: string;
  name: string;
}
interface IsInternalProject {
  id: number;
  name: string;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  
  submitted = false;
  projectHeader= ''
  filename=""
  uploadedFile:File
  projectType: DropDown[];
  projectManagerName: DropDown[];
  accountManagerName: DropDown[];
  ClientNameList: DropDown[];
  StatusName: DropDown[];
  minDate: Date;
  maxDate: Date;
  CurrencyName:DropDown[];
 
  ProjectCreatedDate: FormControl =  new FormControl();
  ProjectStartDate: FormControl =  new FormControl();
  ProjectClosureDate: FormControl =  new FormControl();
  ContractDate: FormControl =  new FormControl();
  clientNameCtrl: FormControl = new FormControl('',[Validators.required]);
  clientNameFilterCtrl: FormControl = new FormControl();
  files: FormControl = new FormControl();

  searchTerm$ = new Subject<string>();
  private _onDestroy = new Subject<void>();
  
  internalProject: IsInternalProject[] = [
    { id: 1, name: "Yes" },
    { id: 0, name: "No" }
  ];
  
  project: Project;

  public filteredClientName: ReplaySubject<DropDown[]> = new ReplaySubject<DropDown[]>(1);
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  projectForm = new FormGroup
  ({
    ProjectName: new FormControl('', [Validators.required]),
   
    ProjectShortName: new FormControl(),
    Description: new FormControl(),
    ProjectType: new FormControl('', [Validators.required]),
    CurrencyId: new FormControl('', [Validators.required]),
    ProjectValue: new FormControl('', [Validators.required]),
    IsInternalProject: new FormControl('', [Validators.required]),
    ProjectRemark: new FormControl(),
    BillingHours: new FormControl('', [Validators.required]),
    signedContract: new FormControl('', [Validators.required]),
    Status: new FormControl('', [Validators.required]),
    ProjectManager: new FormControl('', [Validators.required]),
    AccountManager: new FormControl('', [Validators.required]),
 
    //ContractDetails: new FormControl('', [Validators.required]),
  });
  attachmentFileName: any;
  
  constructor(private _projectService: ProjectService,private globals: Globals,private http: HttpClient,private spinner: NgxSpinnerService,
     @Inject(MAT_DIALOG_DATA) private data: any, private sharedModule: SharedModule,private dialogRef: MatDialog) { 
      
     }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
        this.minDate = new Date(currentYear-10, 1,11);
        this.maxDate = new Date(currentYear + 2, 11, 31);
    this._projectService.getProjectProjectType().subscribe(res => {
      this.projectType = res.data;
    });
    this._projectService.getCurrency().subscribe(res => {
      this.CurrencyName = res.data;
    });
    this._projectService.getProjectProjectManager().subscribe(res => {
      this.projectManagerName = res.data;
    });
   
    this._projectService.getProjectAccountManager().subscribe(res => {
      this.accountManagerName = res.data;
    });
    this._projectService.getClientName().subscribe(res => {
      this.ClientNameList = res.data;
     this.filteredClientName.next(this.ClientNameList.slice());
   });
   this.clientNameFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
     this.filterClientName();
   });
 
    this._projectService.getProjectStatus().subscribe(res => {
      this.StatusName = res.data;
    });
    this.projectHeader="Add Project"
    if (this.data.id !== 0) {
      this.projectHeader="Update Project"
      this._projectService.getProjectById(this.data.id).subscribe(res => {
        this.projectForm.controls['ProjectName'].setValue(res.data[0].projectName);
        this.clientNameCtrl.setValue(res.data[0].client);
        this.projectForm.controls['ProjectShortName'].setValue(res.data[0].projectShortName);
        this.projectForm.controls['Description'].setValue(res.data[0].description);
        this.projectForm.controls['ProjectType'].setValue(res.data[0].projectType);
        this.ProjectStartDate.setValue(res.data[0].projectStartDate);
        this.ProjectCreatedDate.setValue(res.data[0].projectCreateddate);
        this.projectForm.controls['CurrencyId'].setValue(res.data[0].currency);
        this.projectForm.controls['ProjectValue'].setValue(res.data[0].projectValue);
        this.ProjectClosureDate.setValue(res.data[0].projectClosureDate);
        this.projectForm.controls['IsInternalProject'].setValue(res.data[0].isInternalproject);
        this.projectForm.controls['ProjectRemark'].setValue(res.data[0].projectRemarks);
        this.projectForm.controls['BillingHours'].setValue(res.data[0].billingHours);
        this.projectForm.controls['Status'].setValue(res.data[0].status);
        this.projectForm.controls['ProjectManager'].setValue(res.data[0].projectManager);
        this.projectForm.controls['AccountManager'].setValue(res.data[0].accountManager);
        this.ContractDate.setValue(res.data[0].contractDate);
        this.files.setValue(res.data[0].uploadContract)
       this.filename=res.data[0].uploadContract;
        this.projectForm.controls['signedContract'].setValue(res.data[0].signedContract)
        if(res.data[0].signedContract!='1')
        {
          document.getElementById('contract').style.display="none";
          document.getElementById('contract1').style.display="none";
          document.getElementById('contract2').style.display="none";
        }
       
       // this.projectForm.controls['ContractDetails'].setValue(res.data[0].contractDetails);
      })
     
    }
    else
    {
      document.getElementById('contract').style.display="none";
      document.getElementById('contract1').style.display="none";
      document.getElementById('contract2').style.display="none";
    }
  }
  // dateStart(event: MatDatepickerInputEvent<Date>)
  // {
  //   const currentYear = new Date().getFullYear();
  //   this.minDate = new Date(event.value.getUTCFullYear(), event.value.getUTCMonth(), event.value.getUTCDay());
  //   this.maxDate = new Date(currentYear + 2, 11, 31);
  //   console.log(this.minDate,this.maxDate)
  // }
  ChangeContract()
  {
    if(this.projectForm.controls['signedContract'].value=='1')
    {
      document.getElementById('contract').style.display="inline";
      document.getElementById('contract1').style.display="inline";
      document.getElementById('contract2').style.display="inline";
    }
    else{
      document.getElementById('contract').style.display="none";
      document.getElementById('contract1').style.display="none";
      document.getElementById('contract3').style.display="none";
    }
  }
  ngAfterViewInit() { this.setInitialValue(); }
  ngOnDestroy() { this._onDestroy.next(); this._onDestroy.complete(); }

  private setInitialValue() {
    this.filteredClientName
    .pipe(take(0), takeUntil(this._onDestroy))
    .subscribe(() => {
      this.singleSelect.compareWith = (a: DropDown, b: DropDown) => a.id === b.id;
    });
  }

  public filterClientName() {
    if (!this.ClientNameList) {
      return;
    }
    // get the search keyword
    let search = this.clientNameFilterCtrl.value;
    if (!search) {
      this.filteredClientName.next(this.ClientNameList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredClientName.next(
      this.ClientNameList.filter(clientName => clientName.name.toLowerCase().indexOf(search) > -1)
    );
  }
  get f() { return this.projectForm.controls; }
  alphabate(evt) {
    evt = (evt) ? evt : window.event;
    const charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode !== 46 && (charCode < 97 || charCode > 122 ))) {
        return false;
          } else {
            return true;
        }
      }
  number(evt) {
     evt = (evt) ? evt : window.event;
    const charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode !== 46 && (charCode < 48 || charCode > 57 ))) {
         return false;
            } else {
                return true;
            }
          }
  
  public upload(files) {
    this.uploadedFile=files;
  }
  
  onSubmit() {
    let fname=this.filename
    this.submitted = true;
    this.spinner.show();
    if(this.projectForm.invalid==true)
    {
      this.spinner.hide();
      return false;
    }
    if (this.uploadedFile!=null) {
      let fileToUpload = <File>this.uploadedFile[0];
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      fname=fileToUpload.name;
      this.http.post( `${environment.url}Project/upload`, formData).subscribe(element => {
          fname=element["data"];
          if(element["status"]==true)
              this.DataTobeInserted(fname)
          else
          {
              this.spinner.hide();  
              this.sharedModule.alertNotification(element["message"], 'danger');
          }
            
      });
    }
  else{
    this.DataTobeInserted(fname)
    }
}
  DownLoadFiles(){  
    let fileName = this.filename;
    //file type extension
    let checkFileType =  fileName.split('.').pop();
    var fileType;
    if(checkFileType == ".pdf")
    {
      fileType = "application/pdf";
    }
    if(checkFileType == ".doc")
    {
      fileType = "application/vnd.ms-word";
    }
    if(checkFileType == ".docx")
    {
      fileType = "application/vnd.ms-word";
    }
    this._projectService.DownloadFile(fileName, fileType).subscribe(
              success => {
                saveAs(success, fileName); 
              },  
              err => {
                this.sharedModule.alertNotification("Server error while downloading file.", 'danger');
                 
              }
          );
  }
  DataTobeInserted(fname)
  {
    const project = new Project();
    project.projectName = this.projectForm.controls['ProjectName'].value,
    project.client = this.clientNameCtrl.value,
   
    project.clientName = this._projectService.getDropDownText(this.clientNameCtrl.value,this.ClientNameList);
    project.projectShortName = this.projectForm.controls['ProjectShortName'].value,
    project.description = this.projectForm.controls['Description'].value;
    project.projectType = this.projectForm.controls['ProjectType'].value;
    project.projectCreateddate = new Date(this.ProjectCreatedDate.value).toLocaleDateString(); 
    project.projectStartDate = new Date(this.ProjectStartDate.value).toLocaleDateString(); 
    project.currency=this.projectForm.controls['CurrencyId'].value;
    project.currencyName=this._projectService.getDropDownText(this.projectForm.controls['CurrencyId'].value,this.CurrencyName);
    project.projectValue = this.projectForm.controls['ProjectValue'].value;
    project.projectClosureDate = new Date(this.ProjectClosureDate.value).toLocaleDateString();
    project.isinternalproject = this.projectForm.controls['IsInternalProject'].value;
    project.projectRemarks = this.projectForm.controls['ProjectRemark'].value;
    project.billingHours = this.projectForm.controls['BillingHours'].value;
    project.status = this.projectForm.controls['Status'].value;
    project.projectManager = this.projectForm.controls['ProjectManager'].value;
    project.projectManagerName=this._projectService.getDropDownText(this.projectForm.controls['ProjectManager'].value,this.projectManagerName);
    project.accountManager = this.projectForm.controls['AccountManager'].value;
    project.accountManagerName=this._projectService.getDropDownText(this.projectForm.controls['AccountManager'].value,this.accountManagerName);
    project.signedContract= this.projectForm.controls['signedContract'].value;
    project.adminEmail=this.globals.UserEmailId();
    project.adminName=localStorage.getItem('Name')
    project.Contractdate = new Date(this.ContractDate.value).toLocaleDateString();
    project.UploadContract=fname
    project.companyId=this.globals.companyId();
     
   
  
    //project.contractDetails = this.projectForm.controls['ContractDetails'].value;
    project.createdBy = this.globals.UserId();
    project.modifiedBy = this.globals.UserId();
    if (this.data.id === 0) { // Add Data
      this._projectService.addProject(project).subscribe(res => {
        this.project = res.data;
        if (res.status) {
          this.spinner.hide();
          this.sharedModule.alertNotification(res.message, 'success');
        }
      })
      this.dialogRef.closeAll();
    } else { // Update Data

      this._projectService.updateProject(this.data.id, project).subscribe(res => {
        this.project = res.data;
        if (res.status) {
          this.spinner.hide();
          this.sharedModule.alertNotification(res.message, 'success');
        }
      })
      this.dialogRef.closeAll();
    }
  }
 
}
