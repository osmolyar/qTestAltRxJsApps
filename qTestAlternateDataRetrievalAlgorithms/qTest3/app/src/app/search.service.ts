import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { GridOptions, GridOptionsWrapper } from 'ag-grid-community/main';
import { BehaviorSubject, Observable } from 'rxjs-compat';
    
@Injectable({
  providedIn: 'root'
})
export class SearchService {
    
    private viewType = new BehaviorSubject('Search');
    currentView = this.viewType.asObservable();
    
    private query = new BehaviorSubject('');
    currentQuery = this.query.asObservable();
    
    private rowData = new BehaviorSubject([]);
    currentRowData = this.rowData.asObservable();
    
    private showFilters = new BehaviorSubject(true);
    currentShowFilters = this.showFilters.asObservable();
    
  constructor(private http: HttpClient) {
  }
  
  // private options = { headers: new HttpHeaders().set('Content-Type', 'application/json')

  private options = { headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Bearer a12fc509-2fad-4ed4-ba57-3208b6cdc9cd'
  })};
  
  changeView(viewType: string) {
      this.viewType.next(viewType)
  };
  
  changeQuery(query: string) {
      this.query.next(query)
  };
  changeRowData(rowData) {
      this.rowData.next(rowData)
  };
  changeShowFilters(showFilters) {
      this.showFilters.next(showFilters)
  };
  
  generateGetFunction(url: string):  Observable<any> {
      return this.http.get(url, this.options);
  }

  generatePostFunction( url: string, data):  Observable<any> {
    return this.http.post(url, data, this.options);
  }
}
