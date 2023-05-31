import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Projectallocation, Searchprojectallocation } from 'app/models/projectallocation';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Globals } from './globalfile';


@Injectable()

export class ProjectAllocationService {

    private _refreshNeeded$ =  new Subject<void>();
    url: string;
    urlDropDown: string;
    urlSearch: string;

    constructor(private httpclient: HttpClient,private globals:Globals) {
        this.url = `${environment.url}ProjectAllocation`;
        this.urlDropDown = `${environment.url}DropDown`;
        this.urlSearch = `${environment.url}ProjectAllocation/search`;
    }
    searchAllocation(terms: Observable<string>, searchprojectallocation: Searchprojectallocation) {
        return terms.debounceTime(100)
        .distinctUntilChanged()
        .switchMap(() => this.searchEntries(searchprojectallocation));
    }
    searchEntries(searchprojectallocation: Searchprojectallocation): Observable<any> {
        searchprojectallocation.companyId=this.globals.companyId()
        return this.httpclient.post(this.urlSearch, searchprojectallocation)
    }

    get refreshNeeded$() {
        return this._refreshNeeded$;
    }

    getProjectAllocation(): Observable<any> {
        return this.httpclient.get(this.url+'/getProjectAllocation/'+this.globals.companyId());
    }

    getProjectAllocationById(id: number): Observable<any> {
        return this.httpclient.get(this.url + '/' + id);
    }

    addProjectAllocation(projectallocation: Projectallocation): Observable<any> {
       return this.httpclient.post(this.url, projectallocation)
       .pipe(tap(() => {this._refreshNeeded$.next()}));
    }

    deleteProjectAllocation(id: number): Observable<any> {
          return this.httpclient.delete(this.url + '/' + id);
    }

    updateProjectAllocation(id: number, info: Projectallocation): Observable<any> {
        return this.httpclient.put(this.url + '/' + id, info)
        .pipe(tap(() => {this._refreshNeeded$.next()}));
    }

    // Dropdown Fill API
    getProjectAllocationProjectName(): Observable<any> {
        return this.httpclient.get(this.urlDropDown  +'/Projectallocation/'+this.globals.companyId());
    }

    getProjectAllocationEmployeeName(): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/' + 'EmployeeNameList/'+this.globals.companyId());
    }
 
    getProjectAllocationStatus(): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/' + 'projectstatus');
    }
    ShowEmployeeAllocation(id:number): Observable<any> {
        return this.httpclient.get(this.url + '/' + 'SHowEmpAllo/'+id);
    }
    AddEmployeeAllocation(id:number,AllocationPer:string): Observable<any> {
        return this.httpclient.get(this.url + '/' + 'EmpAllo/'+id+'/'+AllocationPer);
    }
    GetProjectStartEndDate(id : number): Observable<any> {
        return this.httpclient.get(this.url +'/ProjectDate/'+id);
    }
}
