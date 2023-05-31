import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Employee, Searchemployee } from 'app/models/employee';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Globals } from './globalfile';

@Injectable()
export class EmployeeService {

    private _refreshNeeded$ =  new Subject<void>();
    url: string;
    urlDropDown: string;
    urlSearch: string;
    constructor(private httpclient: HttpClient,private globals:Globals) {
        this.url = `${environment.url}Employee`;
        this.urlDropDown = `${environment.url}DropDown`;
        this.urlSearch = `${environment.url}Employee/search`;
    }

    searchEmployee(terms: Observable<string>, searchemployee: Searchemployee) {
        return terms.debounceTime(100)
        .distinctUntilChanged()
        .switchMap(() => this.searchEntries(searchemployee));
    }
    searchEntries(searchemployee: Searchemployee): Observable<any> {
        searchemployee.CompanyId=parseInt(this.globals.companyId());
        return this.httpclient.post(this.urlSearch, searchemployee)
    }

    get refreshNeeded$() {
        return this._refreshNeeded$;
    }

    getEmployee(): Observable<any> {
        return this.httpclient.get(this.url+'/GetEmployee/'+this.globals.companyId());
    }

    getEmployeeById(id: number): Observable<any> {
        return this.httpclient.get(this.url + '/' + id);
    }

    addEmployee(employee: Employee): Observable<any> {
       return this.httpclient.post(this.url, employee)
       .pipe(tap(() => {this._refreshNeeded$.next()}));
    }

    deleteEmployee(id: number): Observable<any> {
         return this.httpclient.delete(this.url + '/' + id);
     }

    updateEmployee(id: number, info: Employee): Observable<any> {
         return this.httpclient.put(this.url + '/' + id, info)
        .pipe(tap(() => {this._refreshNeeded$.next()}));
     }
     // Dropdown Fill API
    getEmployeeTechnology(): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/' + 'technology');
    }

    getEmployeeLocation(): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/' + 'Location');
    }
    getEmployeeName(): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/' + 'EmployeeNameList/'+this.globals.companyId());
    }
    getEmployeeRole(): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/' + 'Role');
    }

    getEmployeeStatus(): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/' + 'Status');
    }
}
