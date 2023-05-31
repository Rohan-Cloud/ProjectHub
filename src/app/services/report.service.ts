import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project , Searchproject } from 'app/models/project';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';
import { MileStone, SearchMileStone } from 'app/models/milestone';
import { InvoiceReport, SearchInvoiceReport, Searchbusinessfromclientreport, SearchFreeSummaryReport, SearchReportInvoiceVsCollection, SearchResourceAllocation } from 'app/models/Reports';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Globals } from './globalfile';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable()
export class ReportsService{

    private _refreshNeeded$ =  new Subject<void>();
    url:string;
    urlDropDown:string;
    urlSearch:string
    constructor(private httpclient:HttpClient,private http:Http,private globals:Globals){
        this.url=`${environment.url}reports`;
        this.urlDropDown=`${environment.url}DropDown`;
        this.urlSearch=`${environment.url}reports`;        
    }

    searchInvoiceReport(terms: Observable<string>,searchInvoiceReport: SearchInvoiceReport){
        return terms.debounceTime(100)
        .distinctUntilChanged()
        .switchMap(() => this.searchEntries(searchInvoiceReport));
    }
    searchEntries(searchInvoiceReport:SearchInvoiceReport):Observable<any>  {
        searchInvoiceReport.companyId=this.globals.companyId()
        return this.httpclient
            .post(this.urlSearch+'/search',searchInvoiceReport)              
    }
    searchBusinessFromClientReport(terms: Observable<string>, searchbusinessfromclientreport: Searchbusinessfromclientreport) {
        return terms.debounceTime(100)
        .distinctUntilChanged()
        .switchMap(() => this.searchEntriesBFromC(searchbusinessfromclientreport));
    }
    searchEntriesBFromC(searchbusinessfromclientreport: Searchbusinessfromclientreport): Observable<any>  {
        searchbusinessfromclientreport.companyId=this.globals.companyId()
        return this.httpclient
            .post(this.urlSearch + '/BusinessFromClientReport', searchbusinessfromclientreport)
    }
    SearchFreeSummaryReport(terms: Observable<string>, searchFSR: SearchFreeSummaryReport) {
        return terms.debounceTime(100)
        .distinctUntilChanged()
        .switchMap(() => this.SearchFreeSummaryR(searchFSR));
    }
    SearchFreeSummaryR(SFSR: SearchFreeSummaryReport): Observable<any>  {
        SFSR.CompanyId=this.globals.companyId()
        return this.httpclient
            .post(this.urlSearch + '/SearchFreeSummaryReport', SFSR)
    }
    SearchInvoiceVsCollectionReport(terms: Observable<string>, searchIVC: SearchReportInvoiceVsCollection) {
        return terms.debounceTime(100)
        .distinctUntilChanged()
        .switchMap(() => this.SearchIVSR(searchIVC));
    }
    SearchIVSR(SIVC: SearchReportInvoiceVsCollection): Observable<any>  {
        SIVC.companyId=this.globals.companyId()
        return this.httpclient
            .post(this.urlSearch + '/SearchIVCReport', SIVC)
    }
    SearchResourceAllcoationReport(terms: Observable<string>, searchResourceAllocation: SearchResourceAllocation) {
        return terms.debounceTime(100)
        .distinctUntilChanged()
        .switchMap(() => this.SearchRAR(searchResourceAllocation));
    }
    SearchRAR(SRAR: SearchResourceAllocation): Observable<any>  {
        SRAR.companyId=this.globals.companyId()
        return this.httpclient
            .post(this.urlSearch + '/SearchResourceAllo', SRAR)
    }
    get refreshNeeded$()
    {
        return this._refreshNeeded$;
    }
    getInvoicingReport():Observable<any>{      
        return this.httpclient.get(this.url+'/TotalRevenueReport/'+this.globals.companyId());
    }
    getInvoiceVsCollectionReport():Observable<any>{      
        return this.httpclient.get(this.url+'/IVCReport/'+this.globals.companyId());
    }
    getResourceAllcoationReport():Observable<any>{      
        return this.httpclient.get(this.url+'/ResourceAllo/'+this.globals.companyId());
    }

    // getMileStoneById(id:number):Observable<any>{
    //     return this.httpclient.get(this.url+'/'+id);
    // }

    // addMileStone(milestone:MileStone):Observable<any>{        
    //     return this.httpclient.post(this.url,milestone)
    //     .pipe(tap(()=>{this._refreshNeeded$.next()}));
    // }

    // deleteMileStone(id:number):Observable<any>{
    //     return this.httpclient.delete(this.url+'/'+id);
    // }

    // updateMileStone(id:number,milestone:MileStone):Observable<any>{        
    //     return this.httpclient.put(this.url+'/'+id,milestone)
    //     .pipe(tap(()=>{this._refreshNeeded$.next()}));;
    // }

    // //Dropdown Fill API
    getProjectName():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'Project/'+this.globals.companyId());
    }
    getClientName():Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/'+'Client/'+this.globals.companyId());
    }
    // getCurrency():Observable<any>{        
    //     return this.httpclient.get(this.urlDropDown+'/'+'Currency');
    // }
    getClientProject(id:any):Observable<any>{        
        return this.httpclient.get(this.urlDropDown+'/ClientName/'+id+'/'+this.globals.companyId());
    }
    getBusinessFromClientReport(): Observable<any> {
        return this.httpclient.get(this.url + '/BusinessFromClientReport/'+this.globals.companyId() );
    }
    getFreeSummaryReport(): Observable<any> {
        return this.httpclient.get(this.url + '/FreeSummaryReport/'+this.globals.companyId() );
    }
    // getProjectStatus():Observable<any>{        
    //     return this.httpclient.get(this.urlDropDown+'/'+'projectstatus');
    // }
        public exportAsExcelFile(json: any[], excelFileName: string): void {
            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
            console.log('worksheet',worksheet);
            const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, excelFileName);
        }
        private saveAsExcelFile(buffer: any, fileName: string): void {
            const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        }
}