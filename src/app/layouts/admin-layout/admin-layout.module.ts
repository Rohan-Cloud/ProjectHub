import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { EmployeeComponent } from 'app/employee/employee.component';
import { EmployeeListComponent } from 'app/employee-list/employee-list.component';
import { ProjectComponent } from 'app/project/project.component';
import { ProjectListComponent } from 'app/project-list/project-list.component';
import { ProjectallocationComponent } from 'app/projectallocation/projectallocation.component';
import { ProjectallocationListComponent } from 'app/projectallocation-list/projectallocation-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule, MatTableModule, MatToolbarModule, MatMenuModule, MatNativeDateModule, 
         MatProgressSpinnerModule, 
         MatPaginatorModule} from '@angular/material';
import { MatButtonModule,MatInputModule,MatRippleModule,MatFormFieldModule,
         MatTooltipModule,MatSelectModule,MatDatepickerModule } from '@angular/material';
import { AdminLayoutComponent } from './admin-layout.component';
import { ComponentsModule } from 'app/components/components.module';
import { MatSelectSearchModule } from 'app/mat-select-search/mat-select-search.module';
import { MilestoneComponent } from 'app/milestone/milestone.component';
import { MilestoneListComponent } from 'app/milestone-list/milestone-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { InvoiceComponent } from 'app/invoice/invoice.component';
import { ReportComponent } from 'app/report/report.component';
import { InvoiceListComponent } from 'app/invoice-list/invoice-list.component';
import { ClientComponent } from 'app/client/client.component';
import { ClientListComponent } from 'app/client-list/client-list.component';
import { NgxMaskModule } from 'ngx-mask';
import { ReportstotalinvoicingamountsComponent } from 'app/reportstotalinvoicingamounts/reportstotalinvoicingamounts.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FusionChartsModule } from 'angular-fusioncharts';
import { ReportsbusinessfromclientComponent } from 'app/reportbusinessfromclient/reportsbusinessfromclient.component';
import { ReportDashboardComponent } from 'app/report-dashboard/report-dashboard.component';
import { UserMasterCredentialComponent } from 'app/user-master-credential/user-master-credential.component';
import { ToastrModule } from 'ngx-toastr';
import { ProjectmoduleListComponent } from 'app/projectmodule-list/projectmodule-list.component';
import { ProjectmoduleComponent } from 'app/projectmodule/projectmodule.component';
import { ProfileUploadComponent } from 'app/profile-upload/profile-upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import {MatExpansionModule} from '@angular/material/expansion';
import { ReportfreesummaryreportComponent } from 'app/reportfreesummaryreport/reportfreesummaryreport.component';
import { ReportmilestonesamountreportComponent } from 'app/reportmilestonesamountreport/reportmilestonesamountreport.component';
import { ReportInvoiceVsCollectionreportComponent } from 'app/report-invoice-vs-collectionreport/report-invoice-vs-collectionreport.component';
import { ReportResourceAllocationreportComponent } from 'app/report-resource-allocationreport/report-resource-allocationreport.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule, 
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressSpinnerModule,   
    MatSelectSearchModule, 
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' 
    }),
    ComponentsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule, 
    NgxPaginationModule,
    NgxSpinnerModule,
    NgxMaskModule.forRoot(),
    FusionChartsModule,
    ToastrModule.forRoot() ,
    ImageCropperModule,
    NgMaterialMultilevelMenuModule,
    MatExpansionModule
    
  ],
  declarations: [
    DashboardComponent,         
    EmployeeComponent,
    EmployeeListComponent,    
    ProjectComponent,
    ProjectListComponent,
    ProjectallocationComponent,
    ProjectallocationListComponent,
    AdminLayoutComponent,
    MilestoneComponent,
    MilestoneListComponent,
    InvoiceComponent,
    ReportComponent,
    InvoiceListComponent,
    ClientComponent,
    ClientListComponent,
    ReportstotalinvoicingamountsComponent,
    ReportsbusinessfromclientComponent,
    ReportDashboardComponent,
    UserMasterCredentialComponent,
    ProjectmoduleListComponent,
    ProjectmoduleComponent,
    ProfileUploadComponent,
    ReportfreesummaryreportComponent,
    ReportmilestonesamountreportComponent,
    ReportInvoiceVsCollectionreportComponent,
    ReportResourceAllocationreportComponent
    
  ],
  entryComponents:[EmployeeComponent]
})

export class AdminLayoutModule {}
