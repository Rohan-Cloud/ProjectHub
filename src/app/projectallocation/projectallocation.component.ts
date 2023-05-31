import { Component, OnInit } from '@angular/core';
import { Projectallocation } from 'app/models/projectallocation';
import { ProjectAllocationService } from 'app/services/projectallocatioservice.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Inject } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Globals } from 'app/services/globalfile';


interface DropDown {
  id: string;
  name: string;
}

@Component({
  selector: 'app-projectallocation',
  templateUrl: './projectallocation.component.html',
  styleUrls: ['./projectallocation.component.scss'],
})
export class ProjectallocationComponent implements OnInit {
 
  submitted = false;
  projectAllocationHeader=''
  projectName: DropDown[];
  employeeName: DropDown[];
  isBillable: any = [
    { id: 1, name: "Yes" },
    { id: 0, name: "No" }
  ];
  Allocated:any=[
    {
      name:"0",
      value:"0"
  },
    {
        name:"25",
        value:"25"
    },
    {
        name:"50",
        value:"50"
    },
    {
      name:"75",
      value:"75"
    },
    {
      name:"100",
      value:"100"
    }
  ]
  minDate :any
  maxDate :any
  projctAllocation: Projectallocation;
  allocatedPer=""
  EmpName=""
  projectAllocationForm = new FormGroup
    ({
      ProjectId: new FormControl('', [Validators.required]),
      EmployeeId: new FormControl('', [Validators.required]),
      StartDate: new FormControl('', [Validators.required]),
      EndDate: new FormControl('', [Validators.required]),
      allocatedCtrl: new FormControl('', [Validators.required]),
      IsBillableCtrl: new FormControl('', [Validators.required])
    });
    
  constructor(private _projectAllocationService: ProjectAllocationService,
     @Inject(MAT_DIALOG_DATA) private data: any,private globals:Globals, private sharedModule: SharedModule,private dialogRef: MatDialog) { }

  ngOnInit() {
    document.getElementById("flag").style.display='none'
    this._projectAllocationService.getProjectAllocationProjectName().subscribe(res => {
      this.projectName = res.data;
    });
   
    this._projectAllocationService.getProjectAllocationEmployeeName().subscribe(res => {
      this.employeeName = res.data;
    });
    this.projectAllocationHeader="Add Project Allocation"
    if (this.data.id > 0) {
      this.projectAllocationHeader="Update Project Allocation"
      this._projectAllocationService.getProjectAllocationById(this.data.id).subscribe(res => {
        this.projectAllocationForm.controls['ProjectId'].setValue(res.data[0].projectId);
        this.projectAllocationForm.controls['EmployeeId'].setValue(res.data[0].employeeId);
        this.projectAllocationForm.controls['StartDate'].setValue(res.data[0].startDate);
        this.projectAllocationForm.controls['EndDate'].setValue(res.data[0].endDate);
        this.projectAllocationForm.controls['allocatedCtrl'].setValue(res.data[0].allocatedPercentage);
        this.projectAllocationForm.controls['IsBillableCtrl'].setValue(res.data[0].isBillable);
        this.EmpName=res.data[0].employeeName
        this._projectAllocationService.ShowEmployeeAllocation(res.data[0].employeeId).subscribe(res => {
        this.allocatedPer=res.data[0].allocatedPercentage
        
          if(parseInt(res.data[0].allocatedPercentage)>=75)
         {
           document.getElementById("flag").style.display='inline'
         }
         else
         {
          document.getElementById("flag").style.display='none'
         }
         
          console.log(res.data[0].allocatedPercentage)
          console.log("empanem",res.data[0])
        })
      })
    }
  }

  get f() { return this.projectAllocationForm.controls; }
  ProjectDateRange()
  {
    this._projectAllocationService.GetProjectStartEndDate(this.projectAllocationForm.controls['ProjectId'].value).subscribe(res => {
      this.minDate = new Date(res.data[0].startYear,res.data[0].startMonth,res.data[0].startDay)
      this.maxDate = new Date(res.data[0].EndYear,res.data[0].EndMonth,res.data[0].EndDay)
    });
  }
  GetEmployeeAllocation(id)
  {
    this._projectAllocationService.ShowEmployeeAllocation(id).subscribe(res => {
      this.allocatedPer=res.data[0].allocatedPercentage
      if(parseInt(res.data[0].allocatedPercentage)>=75)
     {
       document.getElementById("flag").style.display='inline'
     }
     else
     {
      document.getElementById("flag").style.display='none'
     }
     
      console.log(res.data[0].allocatedPercentage)
    })

  }
  onSubmit() {
    this.submitted = true;
    if(this.projectAllocationForm.invalid==true)
    {
      return false;
    }
    const projectallocation = new Projectallocation();
    projectallocation.projectId = this.projectAllocationForm.controls['ProjectId'].value;
    projectallocation.employeeId = this.projectAllocationForm.controls['EmployeeId'].value,
    projectallocation.startDate = new Date( this.projectAllocationForm.controls['StartDate'].value).toLocaleDateString();
    projectallocation.endDate = new Date(this.projectAllocationForm.controls['EndDate'].value).toLocaleDateString();
    projectallocation.allocatedPercentage= this.projectAllocationForm.controls['allocatedCtrl'].value
    projectallocation.isBillable=this.projectAllocationForm.controls['IsBillableCtrl'].value
    projectallocation.companyId=this.globals.companyId()
    this._projectAllocationService.AddEmployeeAllocation( projectallocation.employeeId,projectallocation.allocatedPercentage).subscribe(res => {
      
    })
    if (this.data.id === 0) {  // Add Data
      this._projectAllocationService.addProjectAllocation(projectallocation).subscribe(res => {
        this.projctAllocation = res.data;
        if (res.status) {
          this.sharedModule.alertNotification(res.message, 'success');
        }
      })
      this.dialogRef.closeAll();
    }  else {   // Update Data
      this._projectAllocationService.updateProjectAllocation(this.data.id, projectallocation).subscribe(res => {
        this.projctAllocation = res.data;
        if (res.status) {
          this.sharedModule.alertNotification(res.message, 'success');
        }
      })
      this.dialogRef.closeAll();
    }
  }
  
}
