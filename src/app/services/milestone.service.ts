import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project , Searchproject } from 'app/models/project';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';
import { MileStone, SearchMileStone } from 'app/models/milestone';
import { Globals } from './globalfile';

@Injectable()
export class MileStoneService{

    private _refreshNeeded$ =  new Subject<void>();
    url:string;
    urlDropDown:string;
    urlSearch:string
    constructor(private httpclient:HttpClient,private http:Http,private globals:Globals){
        this.url=`${environment.url}milestone`;
        this.urlDropDown=`${environment.url}DropDown`;
        this.urlSearch=`${environment.url}milestone/search`;        
    }

    searchMileStone(terms: Observable<string>,searchMileStone: SearchMileStone){
        return terms.debounceTime(100)
        .distinctUntilChanged()
        .switchMap(() => this.searchEntries(searchMileStone));
    }
    searchEntries(searchMileStone:SearchMileStone):Observable<any>  {
       searchMileStone.companyId=this.globals.companyId();
        return this.httpclient
            .post(this.urlSearch,searchMileStone)              
    }
    get refreshNeeded$()
    {
        return this._refreshNeeded$;
    }
    getMileStone():Observable<any>{      
        return this.httpclient.get(this.url+'/getMilestone/'+this.globals.companyId());
    }

    getMileStoneById(id:number):Observable<any>{
        return this.httpclient.get(this.url+'/'+id);
    }

    addMileStone(milestone:MileStone):Observable<any>{        
        return this.httpclient.post(this.url,milestone)
        .pipe(tap(()=>{this._refreshNeeded$.next()}));
    }

    deleteMileStone(id:number):Observable<any>{
        return this.httpclient.delete(this.url+'/'+id);
    }

    updateMileStone(id:number,milestone:MileStone):Observable<any>{        
        return this.httpclient.put(this.url+'/'+id,milestone)
        .pipe(tap(()=>{this._refreshNeeded$.next()}));;
    }

    //Dropdown Fill API
    getProjectName():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'Project/'+this.globals.companyId());
    }
    getClientName():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'Client/'+this.globals.companyId());
    }
    getCurrency():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'Currency');
    }
    getClientProject(id:any):Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/ClientName/'+id+'/'+this.globals.companyId());
    }

    getProjectStatus():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'projectstatus');
    }
}