import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Report } from 'app/models/invoice';
import { InvoiceService } from 'app/services/invoiceservice.service';

import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas'; 
import { SharedModule } from 'app/shared/shared.module';
import { Globals } from 'app/services/globalfile';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  
  CurruncySign:string=' '
  subtotal:number=0;
  date:string='';
  invoiceId:number=0;
  clientname:string=" "
  clientCompanyName:string=" "
  clientEmailId:string=" "
  clientContactNo:string=" "
  clientAddress = ' '
  projectName = ' '
  paymentStatus= ' '
  amountPaid=0
  balanceDue =0 
  projectShortName:string=" "

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,private globals:Globals,private sharedModule: SharedModule,private _invoiceService: InvoiceService) { }
  reportList:Report[];
  report = new Report()
  ngOnInit() { 

    this.report.projectId= this.data.projectid,
    this.report.clientId=this.data.clientid
    this.report.milestoneid= this.data.milestone
    this.report.companyId=this.globals.companyId();
    if(this.data.milestone != ' ')
    {
      this._invoiceService.getReport(this.report).subscribe(res => {
        this.reportList=res.data;
        this.clientname=res.data[0].clientName
        this.date=res.data[0].modifiedDate
        this.invoiceId=res.data[0].invoiceId
        this.clientCompanyName=res.data[0].clientCompanyName
        this.clientEmailId=res.data[0].clientEmailId
        this.clientContactNo=res.data[0].clientContactNo
        this.clientAddress=res.data[0].clientAddress
        this.projectShortName=res.data[0].projectShortName
        this.CurruncySign=res.data[0].currencySign
        this.projectName=res.data[0].projectName
        this.paymentStatus=res.data[0].paymentStatus
        res.data.forEach(element => {
            this.subtotal=this.subtotal+element.amount
        });
        if(this.paymentStatus == 'pending')
        {
          this.balanceDue=this.subtotal
          this.amountPaid=0
        }
        else
        {
          this.amountPaid=this.subtotal
          this.balanceDue=0
        }
      });
    }
   
  }
  genratePdf()
  {
      var data1 = document.getElementById('print') ;
      html2canvas(data1).then(canvas => {  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
      const contentDataURL = canvas.toDataURL("image/PNG")  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('Invoice.pdf'); // Generated PDF   
     });
  }
}
