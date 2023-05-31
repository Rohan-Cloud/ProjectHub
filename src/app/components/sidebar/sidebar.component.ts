import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from "app/shared/shared.module";
import { ProfileUploadComponent } from 'app/profile-upload/profile-upload.component';
import { MatDialog } from '@angular/material';
import { Globals } from 'app/services/globalfile';
import { UserMasterService } from 'app/services/usermaster.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
declare interface RouteInfo1 {
  link: string;
  label: string;
  faIcon: string;
  class: string;

}
export const ROUTES: RouteInfo[] = [
  { path: '/admin/dashboard', title: 'Dashboard', icon: 'dashboard', class: 'active' },
  //{ path: '/employee', title: 'Employees',  icon:'person', class: '' },
  { path: '/admin/employee-list', title: 'Employees ', icon: 'content_paste', class: 'employee' },
  //{ path: '/project', title: 'Project ',  icon:'content_paste', class: '' },
  { path: '/admin/project-list', title: 'Projects ', icon: 'classe', class: 'project' },
  //{ path: '/projectallocation', title: 'Project Allocation ',  icon:'assignment_turned_in', class: '' },
  { path: '/admin/projectallocation-list', title: 'Project Allocations  ', icon: 'assignment_turned_in', class: 'projectallocation' },
  // { path: '/login', title: 'Logout', icon:'exit_to_app',class: ''},
  { path: '/admin/milestone-list', title: 'Milestones', icon: 'turned_in', class: 'milestone' },
  { path: '/admin/projectmodule-list', title: 'Project Module', icon: 'description', class: 'projectmodule' },
  { path: '/admin/client-list', title: 'Clients', icon: 'face', class: 'client' },

  //{ path: '/admin/milestone', title: 'MileStone  ',  icon:'turned_in', class: '' },
  // { path: '/admin/invoice', title: 'Invoice',  icon:'description', class: '' },
  { path: '/admin/invoice-list', title: 'Invoices', icon: 'receipt', class: 'invoice' },
  { path: '/admin/report-dashboard', title: 'Reports', icon: 'description', class: 'B2C' },
  //  { path: '/admin/BuisnessFromClient', title: 'Business From Client',  icon:'description', class: 'B2C' },
  //  { path: '/admin/TotalInvoiceReport', title: 'Total Invoicing ',  icon:'description', class: 'totalinvoice' },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  userName: string;
  constructor(private _userMasterService: UserMasterService, private globals: Globals, private router: Router, private sharedModule: SharedModule, private dialog: MatDialog) { }
  photo: any;
  imageToShow: any;

  ngOnInit() {

    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.userName = localStorage.getItem('Name');

    let filename = this.globals.profile()
    let filetype = "image/jpeg"
    this._userMasterService.getprofile(filename, filetype).subscribe(
      success => {
        this.createImageFromBlob(success)
      },
      err => {
        this.imageToShow = '/assets/img/admin.png'
      }
    );
  }
  ROUTES1 = [
    {
      link: '/admin/dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      class: 'active',
      active: true
    },
    {
      link: '/admin/employee-list',
      label: 'Employees ',
      icon: 'content_paste',

    },
    {

      label: 'Projects ',
      icon: 'classe',

      items: [
        {
          link: '/admin/project-list',
          label: 'Projects ',
          icon: 'classe',

        },
        {
          link: '/admin/projectallocation-list',
          label: 'Project Allocations  ',
          icon: 'assignment_turned_in',

        },
        {
          link: '/admin/milestone-list',
          label: 'Milestones',
          icon: 'turned_in',
        },
        {
          link: '/admin/projectmodule-list',
          label: 'Project Module',
          icon: 'description',
        },
      ]
    },
    {
      link: '/admin/client-list',
      label: 'Clients',
      icon: 'face',
    },
    {
      link: '/admin/invoice-list',
      label: 'Invoices',
      icon: 'receipt',
    },
    {

      label: 'Reports',
      icon: 'description',
      items: [
        {
          link: '/admin/FreeSummaryReport',
          label: 'Free Summary Report ',
          icon: 'classe',

        },
        {
          link: '/admin/MilestoneAmountReport',
          label: 'Milestone Amount Report ',
          icon: 'classe',

        },
        {
          link: '/admin/InvoiceVsCollectionReport',
          label: 'Invoice Vs Collection Report ',
          icon: 'classe',

        },
        {
          link: '/admin/ResourceAllocationReport',
          label: 'Resource Allocation Report ',
          icon: 'classe',

        },
        {
          link: '/admin/report-dashboard',
          label: 'Reports ',
          icon: 'classe',
        }



      ]
    },
    {
      link: '',
      label: 'Logout',
      icon: 'exit_to_app',
      onSelected: function () {
        this.sharedModule.alertNotification("Logged out..!", 'success');
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    },
  ]
  config = {
    paddingAtStart: true,
    classname: 'my-custom-class',
    interfaceWithRoute: true,
    fontColor: 'rgb(8, 54, 71)',

    selectedListFontColor: 'red',
    highlightOnSelect: true,
    collapseOnSelect: true,
    rtlLayout: false
  };

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;

    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  profile() {
    this.dialog.open(ProfileUploadComponent, { data: { id: this.globals.EmployeeId() } })
  }
  logout() {
    this.sharedModule.alertNotification("Logged out..!", 'success');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
