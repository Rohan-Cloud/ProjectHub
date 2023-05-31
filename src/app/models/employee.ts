export class Employee {
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
export class Searchemployee {
    keyword: string;
    technology: number;
    location: number;
    status: number;
    role: number;
    columnName: string;
    order = 'ASC'
    PageSize: number;
    page: number
    CompanyId:number;
}
