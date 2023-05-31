import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectModuleService } from 'app/services/projectmodule.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProjectModule, SearchProjectModule } from 'app/models/projectmodule';
import { SharedModule } from 'app/shared/shared.module';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { Globals } from 'app/services/globalfile';

interface DropDown {
  id: string;
  name: string;
}

@Component({
  selector: 'app-projectmodule',
  templateUrl: './projectmodule.component.html',
  styleUrls: ['./projectmodule.component.scss']
})
export class ProjectmoduleComponent implements OnInit {

  projectName: DropDown[];
  clientName: DropDown[];
  StatusName: DropDown[];

  submitted = false;
  projectModule: ProjectModule
  status = true;
  projectModuleHeader = ''
  StartDate: FormControl =  new FormControl();
  EndDate:  FormControl =  new FormControl();

  searchTerm$ = new Subject<string>();
  projectModule1 = new SearchProjectModule();
  ProjectModuleForm = new FormGroup (
    {
      ModuleName: new FormControl('', [Validators.required]),
      ClientId: new FormControl('', [Validators.required]),
      ProjectId: new FormControl('', [Validators.required]),
      Hours: new FormControl('', [Validators.required]),
      Description: new FormControl(),
      StatusCtrl: new FormControl('', [Validators.required]),
    }
  )
  constructor(private _projectModuleService: ProjectModuleService,private globals:Globals, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any, private sharedModule: SharedModule, private dialogRef: MatDialog) { }

  ngOnInit() {

    this._projectModuleService.getProjectName().subscribe(res => {
      this.projectName = res.data;
    });

    this._projectModuleService.getClientName().subscribe(res => {
      this.clientName = res.data;
    });

    this._projectModuleService.getProjectStatus().subscribe(res => {
      this.StatusName  = res.data;
    });
    this.projectModuleHeader = 'Add Project Module'

    if (this.data.id > 0) {
      this.projectModuleHeader = 'Update Project Module'
      this._projectModuleService.getProjectModuleById(this.data.id).subscribe(res => {
        this.ProjectModuleForm.controls['ModuleName'].setValue(res.data[0].name);
        this.ProjectModuleForm.controls['ClientId'].setValue(res.data[0].clientId);
        this._projectModuleService.getClientProject(this.ProjectModuleForm.controls['ClientId'].value).subscribe(res => {
          this.projectName = res.data;
        }, error => {console.log(error)});
        this.ProjectModuleForm.controls['ProjectId'].setValue(res.data[0].projectId);
        this.ProjectModuleForm.controls['Hours'].setValue(res.data[0].hour);
        this.ProjectModuleForm.controls['StatusCtrl'].setValue(res.data[0].status);
        this.ProjectModuleForm.controls['Description'].setValue(res.data[0].description);
        this.StartDate.setValue(res.data[0].startDate);
        this.EndDate.setValue(res.data[0].endDate);
        this.status = false;
      })
    }
  }
  dd()  {
    this._projectModuleService.getClientProject(this.ProjectModuleForm.controls['ClientId'].value).subscribe(res => {

      this.projectName = res.data;
    }, error => {console.log(error)});
  }

  get f() { return this.ProjectModuleForm.controls }
  onDate(event)  {
    this.status = false
  }
  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode < 91)) {
      return false;
    }
    return true;

  }

  onSubmit() {

    this.submitted = true;
    const projectModule = new ProjectModule();
    projectModule.Name = this.ProjectModuleForm.controls['ModuleName'].value;
    projectModule.ClientId = this.ProjectModuleForm.controls['ClientId'].value;
    projectModule.projectId = this.ProjectModuleForm.controls['ProjectId'].value;
    projectModule.Hour = this.ProjectModuleForm.controls['Hours'].value;
    projectModule.Status = this.ProjectModuleForm.controls['StatusCtrl'].value;
    projectModule.Description = this.ProjectModuleForm.controls['Description'].value;
    projectModule.StartDate = new Date(this.StartDate.value).toLocaleDateString();
    projectModule.EndDate = new Date(this.EndDate.value).toLocaleDateString();
    projectModule.modifiedBy =this.globals.UserId();
    projectModule.companyId=this.globals.companyId()

    if (this.data.id !== 0) { //  Update Data
      this.spinner.show();

      this._projectModuleService.updateProjectModule(this.data.id, projectModule).subscribe(res => {
        this.projectModule = res.data;
        if (res.status) {
          this.spinner.hide();
          this.sharedModule.alertNotification(res.message, 'success');
        }
      })
      this.dialogRef.closeAll();
    } else { // Add Data
      projectModule.createdBy =this.globals.UserId();
      this.spinner.show();
      this._projectModuleService.addProjectModule(projectModule).subscribe(res => {
        this.projectModule = res.data;
        if (res.status) {
          this.spinner.hide();
          this.sharedModule.alertNotification(res.message, 'success');
        }
      })
      this.dialogRef.closeAll();
    }
  }
}
