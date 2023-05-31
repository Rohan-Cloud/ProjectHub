import { MileStone, SearchMileStone } from "./milestone"

export class InvoiceReport {
   
    clientName:string
    projectName:string
    totalAmount:number
    invoiceDate:string
    currencyName:string
    paymentStatus:string
    projectManagerName:string
    accountManagerName:string;
    companyId:number
}
export class BusinessFromClientReport {

    client: number;
    clientName: string;
    projectName: string;
    accountManager: number
    accountManagerName: string
    projectManager: number
    projectManagerName: string
    projectStartDate: string
    currencyName:string
    projectValue: number
    fromDate: string
    toDate: string
    companyId:number
}
export class Searchbusinessfromclientreport {
    client: number
    clientName: string
    fromDate: string
    toDate: string
    columnName: string
    order = 'ASC'
    pageSize: number
    page: number
    companyId:number
}
export class SearchInvoiceReport
{
    
    clientId:number;
    projectId:number;
    fromDate:string
    toDate :string
    columnName:string
    order :string
    pageSize:number
    page :number
    companyId:number
}
export class FreeSummaryReport
{
    name: string;
    title: string;
    technology: number;
    emailId:string
    mobileNo:string
    location: number;
    status: number;
    technologyName: string;
    locationName: string;
    statusName: string;
    reportingAuthority: number;
    reportingAuthorityName: string;
    role: string;
    roleName: string;
    companyId:number
    companyName:string
    createdDate: string;
    updatedDate: string;
    joiningDate: string;
    dateofBirth:string
}
export class SearchFreeSummaryReport
{
    fromDate:string
    toDate:string
    columnName: string;
    order = 'ASC'
    PageSize: number;
    page: number
    CompanyId:number;
}
export class ReportMilestoneAmount
{
    Id:number
    Name:string
    ClientId:number
    ClientName:string
    projectId:number
    ProjectName:string
    Status:number
    StatusName:string
    Hour :number
    CurrencyId:number
    CurrencyName:string
    Amount :number
    Description:string
    StartDate:string
    EndDate:string
    companyId:number
    createdDate:string;
    createdBy:number;
    createdByName:string;
    modifiedDate:string;
    modifiedBy:number;
    modifiedByName:string
}
export class SeacrhReportMilestoneAmount 
{
    keyWord:string
    clientId:number;
    projectId:number;
    Status:number;
    currencyId :number
    fromDate:string
    toDate :string
    columnName:string
    order :string
    pageSize:number
    page :number
    companyId:number
}
export class ReportInvoiceVsCollection
{
  invoiceTitle:string   
  clientId:number
  clientName:string
  projectName:string
  invoiceAmount:number
  collectionAmount:number
  recivedAmount:number
  partitionAmountDate:string
  currencyName:string
  paymentMethod:string
}
export class SearchReportInvoiceVsCollection
{
    clientId:number;
    projectId:number;
    fromDate:string
    toDate :string
    columnName:string
    order :string
    pageSize:number
    page :number
    companyId:number
}

export class ReportResourceAllocation
{
  name:string   
  roleName:string
  locationName:string
  projectsName:string
 
}
export class SearchResourceAllocation
{
    projectId:number;
    fromDate:string
    toDate :string
    columnName:string
    order :string
    pageSize:number
    page :number
    companyId:number
}
