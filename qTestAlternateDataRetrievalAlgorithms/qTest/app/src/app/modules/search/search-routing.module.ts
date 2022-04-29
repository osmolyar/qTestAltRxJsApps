import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { PivotGridComponent } from './pivot-grid/pivot-grid.component';
import { SearchHelpComponent } from './search-help/search-help.component';
import { ResultsTableComponent } from './results-table/results-table.component';

const routes: Routes = [
   {
       path: 'search',
       outlet: 'results',
       component: ResultsTableComponent
    },
    {
       path: 'pivot',
       outlet: 'results',
       component: PivotGridComponent
     },
     {
         path: 'source',
         outlet: 'results',
         component: PivotGridComponent
       },
       {
           path: 'kit',
           outlet: 'results',
           component: PivotGridComponent
         },
         {
             path: 'comparison',
             outlet: 'results',
             component: PivotGridComponent
           },
    { path: 'search', 
      component: SearchComponent
    },
    { path: 'searchHelp', 
      component: SearchHelpComponent
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
