export class Projectallocation {
    projectId: number;
    employeeId: number;
    startDate: string;
    endDate: string;
    allocatedPercentage:string;
    isBillable:number;
    createdDate: string;
    updatedDate: string;
    projectName: string;
    employeeName: string;
    companyId:number
}
export class Searchprojectallocation {
    keyword: string;
    projectId: number;
    employeeId: number;
    status: number;
    columnName: string;
    order = 'ASC' ;
    companyId:number
}
