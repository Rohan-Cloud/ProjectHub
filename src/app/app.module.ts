import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';

import { ProjectService } from 'app/services/projectservice.service';

import { MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatPaginatorModule, MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material';
import { LoginComponent} from 'app/login/login.component'
import {
   MatCardModule, MatDialogModule, MatTableModule,MatDatepickerModule,
  MatToolbarModule, MatMenuModule, MatProgressSpinnerModule,
} from '@angular/material';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { tokenintercepterService } from './services/token-interceptor.service';
import { adminloginService } from './services/adminlogin.service';
import { AuthGuard } from './auth/guard/auth.guard';
import { SharedModule } from './shared/shared.module';
import { MatSelectSearchModule } from './mat-select-search/mat-select-search.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotPasswordService } from './services/ForgotPassword.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { MileStoneService } from './services/milestone.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { InvoiceService } from './services/invoiceservice.service';
import { ClientService } from './services/clientservice.service';
import { ProjectAllocationService } from './services/projectallocatioservice.service';
import { EmployeeService } from './services/employeeservice.service';
import { NgxMaskModule } from 'ngx-mask';
import { ReportsService } from './services/report.service';
import { DashboardService } from './services/dashboardservice.service';
import { ProjectComponent } from './project/project.component';
import { Globals } from './services/globalfile';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
 

import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { UserMasterCredentialComponent } from './user-master-credential/user-master-credential.component';
import { UserMasterService } from './services/usermaster.service';
import {MatSelectModule} from '@angular/material/select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ToastrModule } from 'ngx-toastr';
import { ProjectModuleService } from './services/projectmodule.service';
import { ProfileUploadComponent } from './profile-upload/profile-upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import {MatExpansionModule} from '@angular/material/expansion';
import { ReportfreesummaryreportComponent } from './reportfreesummaryreport/reportfreesummaryreport.component';
import { ReportmilestonesamountreportComponent } from './reportmilestonesamountreport/reportmilestonesamountreport.component';
import { ReportInvoiceVsCollectionreportComponent } from './report-invoice-vs-collectionreport/report-invoice-vs-collectionreport.component';
import { ReportResourceAllocationreportComponent } from './report-resource-allocationreport/report-resource-allocationreport.component';
FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,  
    MatIconModule,  MatCardModule, MatDialogModule, MatTableModule,
    MatToolbarModule, MatMenuModule, MatProgressSpinnerModule,
    MatDatepickerModule, MatNativeDateModule  ,
     AdminLayoutModule,  
   // Ng2SearchPipeModule, 
   MatSelectSearchModule,
   MatPaginatorModule,
   NgxSpinnerModule,
   NgxPaginationModule,
   MatSelectModule,
   NgxMaskModule.forRoot(),
   FusionChartsModule,
   SimpleNotificationsModule.forRoot(),
   ToastrModule.forRoot(),
   ImageCropperModule,
   NgMaterialMultilevelMenuModule,
   MatExpansionModule

   
  
  ],
  
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
   
   

    
   
     ],
  providers: [EmployeeService,Globals,ProjectModuleService,MileStoneService,ProjectService,ProjectAllocationService,ForgotPasswordService,adminloginService,ClientService,InvoiceService,DashboardService,UserMasterService,ReportsService,AuthGuard,SharedModule,
      {
    provide:HTTP_INTERCEPTORS,
    useClass:tokenintercepterService,
    multi:true
  },
    ],
  bootstrap: [AppComponent],
 
})

export class AppModule {
 
  
 }
