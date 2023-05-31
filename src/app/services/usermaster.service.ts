import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project, Searchproject } from 'app/models/project';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Http, ResponseContentType } from '@angular/http';
import { MileStone, SearchMileStone } from 'app/models/milestone';
import { UserMaster } from 'app/models/usermaster';

@Injectable()
export class UserMasterService {

    private _refreshNeeded$ = new Subject<void>();
    url: string;
    urlDropDown: string;
    urlSearch: string
    constructor(private httpclient: HttpClient, private http: Http) {
        this.url = `${environment.url}UserMaster`;
        this.urlDropDown = `${environment.url}DropDown`;
        this.urlSearch = `${environment.url}milestone/search`;
    }

    // searchMileStone(terms: Observable<string>,searchMileStone: SearchMileStone){
    //     return terms.debounceTime(100)
    //     .distinctUntilChanged()
    //     .switchMap(() => this.searchEntries(searchMileStone));
    // }
    // searchEntries(searchMileStone:SearchMileStone):Observable<any>  {
    //     return this.httpclient
    //         .post(this.urlSearch,searchMileStone)              
    // }
    get refreshNeeded$() {
        return this._refreshNeeded$;
    }


    addupdateUserMaster(userMaster: UserMaster): Observable<any> {
        return this.httpclient.post(this.url, userMaster)
            .pipe(tap(() => { this._refreshNeeded$.next() }));
    }

    getUserMasterByEmployeeId(id: number): Observable<any> {
        return this.httpclient.get(this.url + '/' + id);
    }

    getprofile(filename: string, fileType: string): Observable<any> {
        let fileExtension = fileType;
        let input = filename;
        return this.http.post(this.url + "/GetProfile/" + input, '',
            { responseType: ResponseContentType.Blob })
            .map(
                (res) => {
                    var blob = new Blob([res.blob()], { type: fileExtension })
                    return blob;
                });

    }

}