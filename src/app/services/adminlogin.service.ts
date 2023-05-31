import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Adminlogin } from "app/models/adminlogin";
import { environment } from "environments/environment";

@Injectable()
export class adminloginService{
    url:string;
    urlDropDown:string;
    constructor(private httpclient : HttpClient)
    {
        
        this.urlDropDown=`${environment.url}DropDown`;
        this.url=`${environment.url}AdminLogin`;
    }

    checkAdminCredential(adminlogin:Adminlogin):Observable<any>{
        return this.httpclient.post(this.url,adminlogin);
    }

    getEmployeeCompany():Observable<any>      
    {
            return this.httpclient.get(this.urlDropDown+'/'+'EmpCompany');
    }
}