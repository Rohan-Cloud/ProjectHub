import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { ProjectModule, SearchProjectModule } from 'app/models/projectmodule';
import { Globals } from './globalfile';

@Injectable()
export class ProjectModuleService {

    private _refreshNeeded$ =  new Subject<void>();
    url: string;
    urlDropDown: string;
    urlSearch: string
    constructor(private httpclient: HttpClient,private globals:Globals) {
        this.url = `${environment.url}projectmodule`;
        this.urlDropDown = `${environment.url}DropDown`;
        this.urlSearch = `${environment.url}projectmodule/search`;
    }

    searchProjectModule(terms: Observable<string>, searchProjectModule: SearchProjectModule) {
        return terms.debounceTime(100)
        .distinctUntilChanged()
        .switchMap(() => this.searchEntries(searchProjectModule));
    }
    searchEntries(searchProjectModule: SearchProjectModule): Observable<any>  {
        searchProjectModule.companyId=this.globals.companyId();
        return this.httpclient
            .post(this.urlSearch, searchProjectModule)
    }
    get refreshNeeded$()  {
        return this._refreshNeeded$;
    }
    getProjectModule(): Observable<any> {
        return this.httpclient.get(this.url+'/getProjectModule/'+this.globals.companyId());
    }

    getProjectModuleById(id: number): Observable<any> {
        return this.httpclient.get(this.url + '/' + id);
    }

    addProjectModule(projectmodule: ProjectModule): Observable<any> {
        return this.httpclient.post(this.url, projectmodule)
        .pipe(tap(() => {this._refreshNeeded$.next()}));
    }

    deleteProjectModule(id: number): Observable<any> {
        return this.httpclient.delete(this.url + '/' + id);
    }

    updateProjectModule(id: number, projectmodule: ProjectModule): Observable<any> {

        return this.httpclient.put(this.url + '/' + id, projectmodule)
        .pipe(tap(() => {this._refreshNeeded$.next()}));
    }

    // Dropdown Fill API
    getProjectName():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'Project/'+this.globals.companyId());
    }
    getClientName():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'Client/'+this.globals.companyId());
    }
    
    getClientProject(id:any):Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/ClientName/'+id+'/'+this.globals.companyId());
    }

    getProjectStatus():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'projectstatus');
    }
}
