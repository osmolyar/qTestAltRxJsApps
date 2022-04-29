import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { AngularDualListBoxModule } from 'angular-dual-listbox';

import { ChartsModule } from 'ng2-charts';

import {MatTabsModule, MatCardModule, MatButtonModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community/main';

import { JsonDisplayComponent } from './json-display/json-display.component';
import { SummaryComponent } from './summary/summary.component';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

import { SearchFiltersComponent } from './search-filters/search-filters.component';
import { FilterSelectComponent } from './filter-select/filter-select.component';
import { ColumnSelectorComponent } from './column-selector/column-selector.component';


import { RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    JsonDisplayComponent,
    SummaryComponent,
    NavHeaderComponent,
    NavBarComponent,
    SearchFiltersComponent,
    ColumnSelectorComponent,
    FilterSelectComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    NgOptionHighlightModule,
    FormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    RouterModule,
    AgGridModule.withComponents([]),
    AngularDualListBoxModule,
  ],
  providers: [],
  bootstrap: [],
  exports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    RouterModule,
    JsonDisplayComponent,
    SummaryComponent,
    NavHeaderComponent,
    NavBarComponent,
    SearchFiltersComponent,
    ColumnSelectorComponent,
    FilterSelectComponent
  ]
})
export class SharedModule { }
