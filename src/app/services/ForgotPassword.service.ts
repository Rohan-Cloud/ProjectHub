import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Adminlogin } from "app/models/adminlogin";
import { environment } from "environments/environment";

@Injectable()
export class ForgotPasswordService
{
    url:string;
    constructor(private httpclient : HttpClient)
    {
        this.url=`${environment.url}ForgotPassword`;
    }
    checkEmail(adminlogin:Adminlogin):Observable<any>{
        return this.httpclient.post(this.url,adminlogin);
    }
    Updatepassword(adminlogin:Adminlogin):Observable<any>{
        return this.httpclient.put(this.url,adminlogin);
    } 
    check(adminlogin:Adminlogin):Observable<any>{
        return this.httpclient.post(this.url+'/checkid/',adminlogin);
    }
}
