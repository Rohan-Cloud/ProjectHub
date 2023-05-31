import { NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from 'angular2-notifications';
import { ToastrService, ToastContainerDirective, ToastrModule } from 'ngx-toastr';

import { Injectable } from '@angular/core';

declare var $: any;

@NgModule({
  declarations: [],
  imports: [
    CommonModule ,
    ToastrModule.forRoot({
      timeOut: 10000,
     positionClass: 'toast-top-right',
      preventDuplicates: true,
    }) 
  ],
  exports:[
    CommonModule, 
  ]
})
export class SharedModule {
  constructor( private toastr: ToastrService ) {}
  
  alertNotification(message,type)
  {  
    if(type=='success')
      this.toastr.success(message);
    if(type=='danger')
      this.toastr.error(message);
  }
   YearRange():any
  {
    let year=[]
    let cy = new Date().getFullYear();
    for (let i = cy ; i > 1995; i--)   {
      year.push(''+i+'-'+ (i+1)+'');
    }
    return year;
  }
 }
