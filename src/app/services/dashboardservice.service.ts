import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project , Searchproject } from 'app/models/project';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';
import { MileStone, SearchMileStone } from 'app/models/milestone';
import { Dashboard_TotalRevenue } from 'app/models/dashboard';
import { Globals } from './globalfile';

@Injectable()
export class DashboardService{

    private _refreshNeeded$ =  new Subject<void>();
    url:string;
    urlDropDown:string;
    urlSearch:string
    constructor(private httpclient:HttpClient,private globals:Globals){
        this.url=`${environment.url}Dashboard`;
        this.urlDropDown=`${environment.url}DropDown`;
    
    }
    searchRevenue(terms: Observable<string>,totalRevenue: Dashboard_TotalRevenue){
        return terms.debounceTime(100)
        .distinctUntilChanged()
        .switchMap(() => this.searchEntries(totalRevenue));
    }
    searchEntries(totalRevenue:Dashboard_TotalRevenue):Observable<any>  {
       totalRevenue.CompanyId=this.globals.companyId()
        return this.httpclient
            .post(this.url,totalRevenue)              
    }
    get refreshNeeded$()
    {
        return this._refreshNeeded$;
    }
    getDashboardItem():Observable<any>{      
        return this.httpclient.get(this.url+'/DashboardItem/'+this.globals.companyId() );
    }
    getTotalRevenue():Observable<any>{      
        return this.httpclient.get(this.url+'/'+'TotalRevenue');
    }
    getB2C():Observable<any>{      
        return this.httpclient.get(this.url+'/'+'B2C/'+this.globals.companyId());
    }
    getCurrency():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'Currency');
    }
   

   
}