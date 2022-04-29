import { Component, OnInit, Input, Output, OnChanges, DoCheck, EventEmitter, SimpleChanges , ViewChild} from '@angular/core';
// import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { AgGridModule } from 'ag-grid-angular';
import { GridOptions, RowNode } from 'ag-grid-community/main';
// import { NgOnChangesFeature } from '@angular/core/src/render3';
// import { ɵɵNgOnChangesFeature } from '@angular/core';
import { RouterModule, Router,Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import { WebDataRocksPivot } from '../../../webdatarocks/src/app/webdatarocks/webdatarocks.angular4';
import { SearchService } from '../../../search.service';


@Component({
  selector: 'app-pivot-grid',
  templateUrl: './pivot-grid.component.html'
})
export class PivotGridComponent   {
    @Input() rowData;
    @Input() viewType:string;
    query: string;
    
    conditions : object[]=
        [
         {
             "formula": "#value = 0",
             "measure": "result",
             "format": {
                 "backgroundColor": "#F44336",
                 "color": "#FFFFFF",
                 "fontFamily": "Arial",
                 "fontSize": "12px"
             }
         },
         {
             "formula": "#value = 1",
             "measure": "result",
             "format": {
                 "backgroundColor": "#009688",
                 "color": "#FFFFFF",
                 "fontFamily": "Arial",
                 "fontSize": "12px"
             }
         },
         {
             "formula": "#value = 2",
             "measure": "result",
             "format": {
                 "backgroundColor": "#3F51B5",
                 "color": "#FFFFFF",
                 "fontFamily": "Arial",
                 "fontSize": "12px"
             }
         }
     ];
    column_type:string="platform";
    slice : {reportFilters: object[],columns:any,rows:any,measures:any};
    formats: object []=
    [
         {
             "textAlign": "center"
         }
     ];
    options: object={
            "grid": {
                "showFilters": false,
                "showReportFiltersArea":false
                
            }
        };
    slice_pivot:{reportFilters: object[],columns:any,rows:any,measures:any}=
    {
            reportFilters: [
              {
                  "uniqueName": "kit"
               }
            ],
            rows: [
                   {
                       uniqueName: "name"
                   }
               ],
               columns: [
                   {
                       uniqueName: this.column_type
                   }
               ],
               measures: [
                   {
                       uniqueName: "result",
                       aggregation: "none",
                       availableAggregations:[],
                       formula: "min('result')",
                   },
               ]
           };
        
    slice_comparison:{reportFilters: object[],columns:any,rows:any,measures:any}=
    {
            reportFilters: [
              {
                  "uniqueName": "kit"
               }
            ],
            rows: [
                   {
                       uniqueName: "kit"
                   },
                   {
                       uniqueName: "source"
                   },
                   {
                       uniqueName: "name"
                   }
               ],
               columns: [
                   {
                       uniqueName: "platform"
                   }
               ],
               measures: [
                   {
                       uniqueName: "result",
                       aggregation: "none",
                       availableAggregations:[],
                       formula: "min('result')",
                   },
               ]
           };


    @ViewChild('pivot1') child: WebDataRocksPivot;
    
    constructor(public router: Router, private searchService: SearchService) {
    }
       
    ngOnInit() {
        this.searchService.currentRowData.subscribe(rowData => this.rowData = rowData);
        this.searchService.currentQuery.subscribe(query => this.query = query);
        this.searchService.currentView.subscribe(viewType => 
        {
            this.viewType = viewType
            
            if (this.viewType=='Kit Comparison') {
                this.slice=this.slice_comparison;
            } else {
                if (this.viewType=='Platforms')
                {this.column_type= 'platform'};
                if (this.viewType=='Sources')
                {this.column_type= 'source'};
                if (this.viewType=='Kits')
                {this.column_type= 'kit'};
                this.slice_pivot.columns[0].uniqueName=this.column_type;
                this.slice=this.slice_pivot;
            }
            if (this.child.webDataRocks) {
                this.child.webDataRocks.off("ready");
                this.setReport();
            }
        });
    }
    onPivotReady(pivot: WebDataRocks.Pivot): void {
          console.log("[ready] WebDataRocksPivot", this.child);
      }

    ngOnChanges(changes: SimpleChanges) {
        if (this.viewType=='Kit Comparison') {
            this.slice=this.slice_comparison;
        } else {
            if (this.viewType=='Platforms')
            {this.column_type= 'platform'};
            if (this.viewType=='Sources')
            {this.column_type= 'source'};
            if (this.viewType=='Kits')
            {this.column_type= 'kit'};
            this.slice_pivot.columns[0].uniqueName=this.column_type;
            this.slice=this.slice_pivot;
        }
        if (this.child.webDataRocks) {
            this.setReport();
        }
   
      }    
    onCustomizeCell(cell: WebDataRocks.CellBuilder, data: WebDataRocks.Cell): void {
        if (data.isClassicTotalRow) cell.addClass("fm-total-classic-r");
        if (data.isGrandTotalRow) cell.addClass("fm-grand-total-r");
        if (data.isGrandTotalColumn) cell.addClass("fm-grand-total-c");
        if (data.value==0) cell.text="FAIL"
        if (data.value==1) cell.text="PASS"
        if (data.value==2) cell.text="SKIP"
      }

    onReportComplete(): void {
      this.child.webDataRocks.off("reportcomplete");
      this.setReport();;
    }
    
    onReportChange(): void {
        this.child.webDataRocks.off("reportchange");
        this.setReport();
     }
    
    setReport() : void {
        this.child.webDataRocks.setReport({
            dataSource: {
                data: this.rowData,
            },
            slice: this.slice,
            conditions: this.conditions,
            formats: this.formats,
            options: this.options
        });
    };
    
  }

