import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MileStoneService } from 'app/services/milestone.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MileStone, SearchMileStone } from 'app/models/milestone';
import { SharedModule } from 'app/shared/shared.module';
import { NgxSpinnerService } from "ngx-spinner";
import { Subject } from 'rxjs';
import { Globals } from 'app/services/globalfile';


interface DropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.scss']
})


export class MilestoneComponent implements OnInit {
  projectName: DropDown[];
  clientName: DropDown[];
  CurrencyName: DropDown[];
  StatusName: DropDown[];


  submitted = false;
  mileStone: MileStone
  status = true;
  mileStoneHeader = ''
  StartDate: FormControl = new FormControl();
  EndDate: FormControl = new FormControl();

  searchTerm$ = new Subject<string>();
  mileStone1 = new SearchMileStone();
  MileStoneForm = new FormGroup
    (
      {
        MileStoneName: new FormControl('', [Validators.required]),
        ClientId: new FormControl('', [Validators.required]),
        ProjectId: new FormControl('', [Validators.required]),
        CurrencyId: new FormControl('', [Validators.required]),
        Hours: new FormControl('', [Validators.required]),
        Amount: new FormControl('', [Validators.required]),
        Description: new FormControl(),
        StatusCtrl: new FormControl('', [Validators.required]),

      }
    )
  constructor(private _mileStoneService: MileStoneService, private spinner: NgxSpinnerService, @Inject(MAT_DIALOG_DATA) public data: any, private globals: Globals, private sharedModule: SharedModule, private dialogRef: MatDialog) { }


  ngOnInit() {

    this._mileStoneService.getProjectName().subscribe(res => {
      this.projectName = res.data;
    });

    this._mileStoneService.getClientName().subscribe(res => {
      this.clientName = res.data;
    });
    this._mileStoneService.getCurrency().subscribe(res => {
      this.CurrencyName = res.data;
    });

    this._mileStoneService.getProjectStatus().subscribe(res => {
      this.StatusName = res.data;
    });
    this.mileStoneHeader = "Add MileStone"

    if (this.data.id > 0) {
      this.mileStoneHeader = "Update MileStone"
      this._mileStoneService.getMileStoneById(this.data.id).subscribe(res => {
        this.MileStoneForm.controls['MileStoneName'].setValue(res.data[0].name);
        this.MileStoneForm.controls['ClientId'].setValue(res.data[0].clientId);
        this._mileStoneService.getClientProject(this.MileStoneForm.controls['ClientId'].value).subscribe(res => {
          this.projectName = res.data;
        }, error => { console.log(error) });
        this.MileStoneForm.controls['ProjectId'].setValue(res.data[0].projectId);
        this.MileStoneForm.controls['Hours'].setValue(res.data[0].hour);
        this.MileStoneForm.controls['CurrencyId'].setValue(res.data[0].currencyId);
        this.MileStoneForm.controls['Amount'].setValue(res.data[0].amount);
        this.MileStoneForm.controls['StatusCtrl'].setValue(res.data[0].status);
        this.MileStoneForm.controls['Description'].setValue(res.data[0].description);
        this.StartDate.setValue(res.data[0].startDate);
        this.EndDate.setValue(res.data[0].endDate);
        this.status = false;

      })
    }
  }

  dd() {
    this._mileStoneService.getClientProject(this.MileStoneForm.controls['ClientId'].value).subscribe(res => {

      this.projectName = res.data;
    }, error => { console.log(error) });
  }

  get f() { return this.MileStoneForm.controls }
  onDate(event) {

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
    const mileStone = new MileStone();
    mileStone.Name = this.MileStoneForm.controls['MileStoneName'].value;
    mileStone.ClientId = this.MileStoneForm.controls['ClientId'].value
    mileStone.projectId = this.MileStoneForm.controls['ProjectId'].value
    mileStone.Hour = this.MileStoneForm.controls['Hours'].value
    mileStone.CurrencyId = this.MileStoneForm.controls['CurrencyId'].value
    mileStone.Amount = this.MileStoneForm.controls['Amount'].value
    mileStone.Status = this.MileStoneForm.controls['StatusCtrl'].value;
    mileStone.Description = this.MileStoneForm.controls['Description'].value
    mileStone.StartDate = new Date(this.StartDate.value).toLocaleDateString();
    mileStone.EndDate = new Date(this.EndDate.value).toLocaleDateString();
    mileStone.modifiedBy = this.globals.UserId();
    mileStone.companyId = this.globals.companyId()

    if (this.data.id != 0) { //  Update Data
      this.spinner.show();
      this._mileStoneService.updateMileStone(this.data.id, mileStone).subscribe(res => {
        this.mileStone = res.data;
        if (res.status) {
          this.spinner.hide();
          this.sharedModule.alertNotification(res.message, 'success');
        }
      })
      this.dialogRef.closeAll();
    }
    else { // Add Data  
      mileStone.createdBy = this.globals.UserId();
      this.spinner.show();
      this._mileStoneService.addMileStone(mileStone).subscribe(res => {
        this.mileStone = res.data;
        if (res.status) {
          this.spinner.hide();
          this.sharedModule.alertNotification(res.message, 'success');
        }
      })
      this.dialogRef.closeAll();
    }

  }
}
