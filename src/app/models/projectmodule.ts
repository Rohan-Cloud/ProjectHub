export class ProjectModule
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
    createdDate:string;
    createdBy:number;
    createdByName:string;
    modifiedDate:string;
    modifiedBy:number;
    modifiedByName:string
    companyId:number;
    
}
export class SearchProjectModule
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
