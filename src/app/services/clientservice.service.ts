import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Client, Searchclient } from 'app/models/client';
import { tap } from 'rxjs/operators';
import { Globals } from './globalfile';

@Injectable()
export class ClientService {
    private _refreshNeeded$ =  new Subject<void>();
    url: string;
    urlSearch: string;
    constructor(private httpclient: HttpClient,private globals:Globals) {
     this.url = `${environment.url}Client`;
     this.urlSearch = `${environment.url}Client/search`;
    }

    searchClient(terms: Observable<string>, searchclient: Searchclient) {
        return terms.debounceTime(100)
        .distinctUntilChanged()
        .switchMap(() => this.searchEntries(searchclient));
    }
    searchEntries(searchclient: Searchclient): Observable<any> {
        searchclient.companyId=this.globals.companyId()
        return this.httpclient.post(this.urlSearch, searchclient)
    }

    get refreshNeeded$() {
        return this._refreshNeeded$;
    }

    getClient(): Observable<any> {
        return this.httpclient.get(this.url+'/getClient/'+this.globals.companyId());
    }

    getClientById(id: number): Observable<any> {
        return this.httpclient.get(this.url + '/' + id);
    }

   addClient(client: Client): Observable <any> {
    return this.httpclient.post(this.url, client)
    .pipe(tap(() => {this._refreshNeeded$.next()}));
   }

   deleteClient(id: number): Observable<any> {
    return this.httpclient.delete(this.url + '/' + id);
   }

   updateClient(id: number, info: Client): Observable<any> {
    return this.httpclient.put(this.url + '/' + id, info)
    .pipe(tap(() => {this._refreshNeeded$.next()}));
   }
}
