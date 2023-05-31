export class Client {
    name: string;
    companyName: string;
    emailId: string;
    alternateEmailId: string;
    contactNo1: string;
    contactNo2: string;
    address: string;
    startDate: string;
    companyId:number
}
export class Searchclient {
    keyword: string;
    columnName: string;
    order = 'ASC'
    PageSize: number;
    page: number
    fromDate: string;
    toDate: string
    companyId:number
}
