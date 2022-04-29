import { NgModule } from '@angular/core';
import { Component,  EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';;
// import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AgGridModule } from 'ag-grid-angular';

import { SearchComponent } from './search/search.component';
import { SearchService } from '../../search.service';;
import { SearchHelpComponent } from './search-help/search-help.component'
import { PivotGridComponent } from './pivot-grid/pivot-grid.component';

import { ResultsTableComponent } from './results-table/results-table.component';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { WebDataRocksModule } from '../../webdatarocks/src/app/app.module';

import { SearchRoutingModule } from './search-routing.module';

@NgModule({
  declarations: [
    SearchComponent,
    SearchHelpComponent,
    PivotGridComponent,
    ResultsTableComponent,
  ],
  imports: [
    SearchRoutingModule,
    NgSelectModule,
    FormsModule,
    // ChartsModule,
    SharedModule,
    WebDataRocksModule,
    AgGridModule

  ],
  exports: [
    SearchComponent,
    SearchHelpComponent,
    PivotGridComponent,
    AgGridModule,
    ResultsTableComponent
  ]
})
export class SearchModule { }
