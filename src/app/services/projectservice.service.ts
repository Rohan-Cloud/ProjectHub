import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project , Searchproject } from 'app/models/project';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Http, ResponseContentType } from '@angular/http';
import * as _ from 'lodash';
import { Globals } from './globalfile';


@Injectable()
export class ProjectService{

    private _refreshNeeded$ =  new Subject<void>();
    url:string;
    urlDropDown:string;
    urlSearch:string
    constructor(private httpclient:HttpClient,private http:Http,private globals:Globals){
        this.url=`${environment.url}Project`;
        this.urlDropDown=`${environment.url}DropDown`;
        this.urlSearch=`${environment.url}Project/search`;  
    }

    searchProject(terms: Observable<string>,searchproject: Searchproject){
        return terms.debounceTime(100)
        .distinctUntilChanged()
        .switchMap(() => this.searchEntries(searchproject));
    }
    searchEntries(searchproject:Searchproject):Observable<any>  {
        searchproject.companyId=parseInt(this.globals.companyId());
        return this.httpclient
            .post(this.urlSearch,searchproject)
                       
    }
   
    get refreshNeeded$()
    {
        return this._refreshNeeded$;
    }
    
    getProject():Observable<any>{      
        return this.httpclient.get(this.url+'/getProject/'+this.globals.companyId());
    }

    getProjectById(id:number):Observable<any>{
        return this.httpclient.get(this.url+'/'+id);
    }

    addProject(project:Project):Observable<any>{        
        return this.httpclient.post(this.url,project)
        .pipe(tap(()=>{this._refreshNeeded$.next()}));
    }

    deleteProject(id:number):Observable<any>{
        return this.httpclient.delete(this.url+'/'+id);
    }

    updateProject(id:number,info:Project):Observable<any>{        
        return this.httpclient.put(this.url+'/'+id,info)
        .pipe(tap(()=>{this._refreshNeeded$.next()}));;
    }
    DownloadFile(filePath: string, fileType:string): Observable<any>{
        let fileExtension = fileType;
        let input = filePath;
        return this.http.post(this.url+"/Download?fileName="+input, '',
        { responseType: ResponseContentType.Blob })
        .map(
          (res) => {
                var blob = new Blob([res.blob()], {type: fileExtension} )
                return blob;            
          });
        } 

    //Dropdown Fill API
    getProjectProjectType():Observable<any>{
        return this.httpclient.get(this.urlDropDown+'/'+'ProjectType');
    }

    getProjectProjectManager():Observable<any>{
        return this.httpclient.get(this.urlDropDown+'/'+'Manager'+'/'+'Project Manager'+'/'+this.globals.companyId());
    }

    getProjectAccountManager():Observable<any>{
        return this.httpclient.get(this.urlDropDown+'/'+'Manager'+'/'+'Account Manager'+'/'+this.globals.companyId());
    }
    getProjectServicedBy():Observable<any>{
        return this.httpclient.get(this.urlDropDown+'/'+'Manager'+'/'+'ServicedBy'+'/'+this.globals.companyId());
    }
    getClientName():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'Client'+'/'+this.globals.companyId());
    }
    getProjectStatus():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'projectstatus');
    }
    getCurrency():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'Currency');
    }
    getDropDownText(id, object){
        var aa
        object.forEach(element => {
            if(element["id"]==id)
            {
                 aa= element["name"]
            }
        });
        return aa.toString()

    }
}