export class Invoice
{
    invoiceTitle:string;
    milestoneid:string
    projectId:number;
    clientId:number
    currencyId:number
    amount:number
    paymentMethod:string
    paymentStatus:string
    createdBy:number
    modifiedBy:number
    companyId:number
    amountPaid1:number
    date1:string
    amountPaid2:number
    date2:string
    amountPaid3:number
    date3:string
}
export class Report extends Invoice
{
    id:number
    invoiceId:number
    name:string
    clientName:string
    projectName:string
    clientCompanyName:string
    clientEmailId:string
    clientContactNo:string
    clientAddress:string    
    projectShortName:string
    currencySign:string
    modifiedDate:string
}
export class SearchInvoice
{
    keyWord:string
    clientId:number;
    projectId:number;
    paymentStatus:string
    fromDate:string
    toDate :string
    columnName:string
    order :string
    pageSize:number
    page :number
    companyId:number
}
export class InvoicePartition
{
    partitionId:number
    invoiceId:number
    createdBy:number
    modifiedBy:number
    amount:number
    partitionAmountDate:string
    list:[]
}
