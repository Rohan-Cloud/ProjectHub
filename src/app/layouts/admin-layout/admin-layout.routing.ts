import { Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { EmployeeComponent } from 'app/employee/employee.component';
import { EmployeeListComponent } from 'app/employee-list/employee-list.component';
import { ProjectComponent } from 'app/project/project.component';
import { ProjectListComponent } from 'app/project-list/project-list.component';
import { ProjectallocationComponent } from 'app/projectallocation/projectallocation.component';
import { ProjectallocationListComponent } from 'app/projectallocation-list/projectallocation-list.component';
import { AdminLayoutComponent } from 'app/layouts/admin-layout/admin-layout.component';
import { Component } from '@angular/core';
import { MilestoneComponent } from 'app/milestone/milestone.component';
import { MilestoneListComponent } from 'app/milestone-list/milestone-list.component';

import { ReportComponent } from 'app/report/report.component';
import { InvoiceComponent } from 'app/invoice/invoice.component';
import { InvoiceListComponent } from 'app/invoice-list/invoice-list.component';
import { ClientComponent } from 'app/client/client.component';
import { ClientListComponent } from 'app/client-list/client-list.component';
import { ReportstotalinvoicingamountsComponent } from 'app/reportstotalinvoicingamounts/reportstotalinvoicingamounts.component';
import { ReportsbusinessfromclientComponent } from 'app/reportbusinessfromclient/reportsbusinessfromclient.component';
import { ReportDashboardComponent } from 'app/report-dashboard/report-dashboard.component';
import { UserMasterCredentialComponent } from 'app/user-master-credential/user-master-credential.component';
import { ProjectmoduleListComponent } from 'app/projectmodule-list/projectmodule-list.component';
import { ProjectmoduleComponent } from 'app/projectmodule/projectmodule.component';
import { ProfileUploadComponent } from 'app/profile-upload/profile-upload.component';
import { ReportfreesummaryreportComponent } from 'app/reportfreesummaryreport/reportfreesummaryreport.component';
import { ReportmilestonesamountreportComponent } from 'app/reportmilestonesamountreport/reportmilestonesamountreport.component';
import { ReportInvoiceVsCollectionreportComponent } from 'app/report-invoice-vs-collectionreport/report-invoice-vs-collectionreport.component';
import { ReportResourceAllocationreportComponent } from 'app/report-resource-allocationreport/report-resource-allocationreport.component';


export const AdminLayoutRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent,data : {title: 'Dashboard'} },            
            { path: 'project', component: ProjectComponent },
            { path: 'employee', component: EmployeeComponent },
            { path: 'projectallocation', component: ProjectallocationComponent },            
            { path: 'employee-list', component: EmployeeListComponent , data : {title: 'Employee'}},
            { path: 'project-list', component: ProjectListComponent ,data : {title: 'Project'}},
            { path: 'projectallocation-list', component: ProjectallocationListComponent,data : {title: 'Project-Allocation'} },
            { path: 'milestone', component:MilestoneComponent,},
            { path: 'milestone-list', component:MilestoneListComponent,data : {title: 'MileStone'}},
            { path: 'client', component: ClientComponent },
            { path: 'client-list', component: ClientListComponent, data : {title: 'Client'} },
            { path: 'invoice', component:InvoiceComponent},
            { path: 'invoice-list', component:InvoiceListComponent,data : {title: 'Invoice'}},
            { path: 'report', component:ReportComponent,data : {title: 'Report'}},
            { path: 'TotalInvoiceReport', component:ReportstotalinvoicingamountsComponent,data : {title: 'Invocing Report'}},
            { path: 'BuisnessFromClient', component:ReportsbusinessfromclientComponent,data : {title: 'Buisness From Client'}},
            { path: 'report-dashboard', component:ReportDashboardComponent,data : {title: 'Report Dashboard'}},
            { path: 'usermaster', component:UserMasterCredentialComponent,data : {title: 'User Master Credential'}},
            { path: 'projectmodule-list', component:ProjectmoduleListComponent,data : {title: 'Project Module'}},
            { path: 'projectmodule', component:ProjectmoduleComponent,data : {title: 'Project Module'}},
            { path: 'profileupload', component:ProfileUploadComponent},
            { path: 'FreeSummaryReport', component:ReportfreesummaryreportComponent,data : {title: 'free Summary Report'}},
            { path: 'MilestoneAmountReport', component:ReportmilestonesamountreportComponent,data : {title: 'MileStone Amount Report'}},
            { path: 'InvoiceVsCollectionReport', component:ReportInvoiceVsCollectionreportComponent,data : {title: 'Invoice Vs Collection Report'}},
            { path: 'ResourceAllocationReport', component:ReportResourceAllocationreportComponent,data : {title: 'Resource Allocation Report'}}
          ]
          
    },
];
