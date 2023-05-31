import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project, Searchproject } from 'app/models/project';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';
import { Report, Invoice, SearchInvoice, InvoicePartition } from 'app/models/invoice';
import { Globals } from './globalfile';

@Injectable()
export class InvoiceService {

    private _refreshNeeded$ = new Subject<void>();
    url: string;
    urlDropDown: string;
    urlReport: string
    urlSearch: string
    constructor(private httpclient: HttpClient, private http: Http, private globals: Globals) {
        this.url = `${environment.url}invoice`;
        this.urlDropDown = `${environment.url}DropDown`;
        this.urlReport = `${environment.url}invoice/report`;
        this.urlSearch = `${environment.url}invoice/invoicesearch`;
    }

    searchInvoice(terms: Observable<string>, searchInvoice: SearchInvoice) {
        return terms.debounceTime(100)
            .distinctUntilChanged()
            .switchMap(() => this.searchEntries(searchInvoice));
    }
    searchEntries(searchInvoice: SearchInvoice): Observable<any> {
        searchInvoice.companyId = this.globals.companyId()
        return this.httpclient
            .post(this.urlSearch, searchInvoice)

    }

    getReport(report: Report): Observable<any> {

        return this.httpclient
            .post(this.urlReport, report)

    }

    get refreshNeeded$() {
        return this._refreshNeeded$;
    }
    getMilestoneByInvoiceId(id: any): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/invoiceid/' + id + '/' + this.globals.companyId());
    }
    getinvoice(): Observable<any> {
        return this.httpclient.get(this.url + '/getInvoiceList/' + this.globals.companyId());
    }

    getInvoiceById(id: number): Observable<any> {
        return this.httpclient.get(this.url + '/' + id);
    }

    addInvoice(invoice: Invoice): Observable<any> {

        return this.httpclient.post(this.url, invoice)
            .pipe(tap(() => { this._refreshNeeded$.next() }));
    }

    deleteInvoice(id: number): Observable<any> {
        return this.httpclient.delete(this.url + '/' + id);
    }

    updateInvoice(id: number, invoice: Invoice): Observable<any> {
        return this.httpclient.put(this.url + '/' + id, invoice)
            .pipe(tap(() => { this._refreshNeeded$.next() }));;
    }

    // //Dropdown Fill API
    getProjectName(): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/' + 'Project/' + this.globals.companyId());
    }
    getClientName(): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/' + 'Client/' + this.globals.companyId());
    }
    getCurrency(): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/' + 'Currency');
    }
    getClientProject(id: any): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/ClientName/' + id + '/' + this.globals.companyId());
    }
    getMileStoneName(cId: any, pid: any): Observable<any> {
        return this.httpclient.get(this.urlDropDown + '/MileStoneName/' + cId + '/' + pid + '/' + this.globals.companyId());
    }
    addInvoicePartition(invoicePartition: InvoicePartition): Observable<any> {

        return this.httpclient.post(this.url + '/invoicePartition', invoicePartition)
            .pipe(tap(() => { this._refreshNeeded$.next() }));
    }
    getInvoicePartition(InvoiceId: any): Observable<any> {
        return this.httpclient.get(this.url + '/PartitionAMT/' + InvoiceId);
    }
    deleteInvoiceParition(id: number): Observable<any> {
        return this.httpclient.delete(this.url + '/DeletePartition/' + id);
    }
    // getProjectStatus():Observable<any>{        
    //     return this.httpclient.get(this.urlDropDown+'/'+'projectstatus');
    // }
}