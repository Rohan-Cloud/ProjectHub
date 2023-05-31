import { Component, OnInit, Inject } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UserMaster } from 'app/models/usermaster';
import { UserMasterService } from 'app/services/usermaster.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { EmployeeService } from 'app/services/employeeservice.service';
import { SharedModule } from 'app/shared/shared.module';
import { Globals } from 'app/services/globalfile';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile-upload',
  templateUrl: './profile-upload.component.html',
  styleUrls: ['./profile-upload.component.scss']
})

export class ProfileUploadComponent implements OnInit {
  name = 'Angular 4';

  usermaster = new UserMaster()
  Header = ''
  photo: any;
  imageToShow: any;
  filename: any

  constructor(private globals: Globals, private http: HttpClient, private dialogRef: MatDialog, private _userMasterService: UserMasterService, @Inject(MAT_DIALOG_DATA) public data: any, private sharedModule: SharedModule) { }
  imageChangedEvent: any = '';
  ngOnInit() {
    this.filename = this.globals.profile()
    let filetype = "image/jpeg"
    this._userMasterService.getprofile(this.filename, filetype).subscribe(
      success => {
        this.createImageFromBlob(success)
      },

    );
    this._userMasterService.getUserMasterByEmployeeId(this.data.id).subscribe(res => {
      if (res.data.length > 0) {
        this.Header = "Update Credentials"
        this.usermaster.FirstName = res.data[0].firstName
        this.usermaster.LastName = res.data[0].lastName
        this.usermaster.EmailId = res.data[0].emailId
        this.usermaster.UserTypeId = parseInt(res.data[0].role)
        this.usermaster.UserName = res.data[0].userName
        this.usermaster.Password = res.data[0].password
        this.usermaster.Status = res.data[0].status
        this.usermaster.UserTypeId = res.data[0].userTypeId
        this.imageChangedEvent = res.data[0].profilePicture
        this.usermaster.RecruiterId = res.data[0].recruiterId
        this.usermaster.ResetId = res.data[0].resetId
        this.usermaster.ModifiedBy = this.globals.UserId()
        this.usermaster.EmployeeId = res.data[0].employeeId
      }


    })
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;

    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }
  imageFile: any
  imageCropped(event: ImageCroppedEvent) {

    this.imageToShow = event.base64
    let ci = this.imageToShow.slice(22);
    const date = new Date().valueOf();
    let text = '';
    const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
    }
    const imageName = date + '.' + text + '.jpeg';
    const imageBlob = this.dataURItoBlob(ci);
    this.imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
    this.usermaster.profilePicture = this.imageFile.name

  }
  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.imageFile, this.imageFile.name);

    let fname = this.imageFile.name;
    this.http.post(`${environment.url}UserMaster/upload`, formData).subscribe(element => {
      fname = element["data"];
      if (element["status"] == true) {
        this.usermaster.profilePicture = fname
        this.usermaster.CompanyId = this.globals.companyId();
        this.usermaster.oldFileName = this.filename
        this._userMasterService.addupdateUserMaster(this.usermaster).subscribe(res => {
          if (res.status) {
            this.sharedModule.alertNotification(res.message, 'success');
          }
          this.dialogRef.closeAll();
        })
      }
      else {

        this.sharedModule.alertNotification(element["message"], 'danger');
      }

    });

  }

}
