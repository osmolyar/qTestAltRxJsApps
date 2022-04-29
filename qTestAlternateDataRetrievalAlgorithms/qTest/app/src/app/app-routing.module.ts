import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SearchComponent } from './modules/search/search/search.component';
import { SearchHelpComponent } from './modules/search/search-help/search-help.component';
import { PivotGridComponent } from './modules/search/pivot-grid/pivot-grid.component';
import { ResultsTableComponent } from './modules/search/results-table/results-table.component';

const routes: Routes = [
   {
     path: 'search',
     outlet: 'results',
     component: ResultsTableComponent
   },
     { path: '', 
       component: SearchComponent
     },
     
     {
      path: '**',
      component: SearchComponent
     }
];

@NgModule({
    imports: [ CommonModule,RouterModule.forRoot(routes, {useHash: true}) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }
