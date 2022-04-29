import { Component, OnInit, Input,Output, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';
// import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { AgGridModule } from 'ag-grid-angular';
import { GridOptions, RowNode } from 'ag-grid-community/main';
// import { NgOnChangesFeature } from '@angular/core/src/render3';
import { RouterModule} from '@angular/router';
import { SearchService } from '../../../search.service';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css']
})
export class ResultsTableComponent implements OnInit, OnChanges {
  @Input() rowData;
  @Input() columnDefs;
  @Input() label;
  gridOptions: GridOptions ;
  gridApi;
  getRowStyle;

  defaultColDef;

  constructor(private searchService: SearchService) {
    this.gridOptions = <GridOptions>{
      columnDefs: [],
      rowData: [],
      groupSelectsChildren: true,
      suppressRowClickSelection: true,

      rowSelection: 'multiple',
      // enableColResize: true,
      // enableSorting: true,
      // enableFilter: true,
      enableRangeSelection: true,
      ensureDomOrder: true,
      rowHeight: 45,
      isExternalFilterPresent: this.isExternalFilterPresent,
      doesExternalFilterPass: this.doesExternalFilterPass,
    };


    this.defaultColDef = {
      editable: true,
      cellStyle: function(params) {
        if (params.value == 'Failed') {
            return {color: 'white', backgroundColor: 'red',  textAlign: 'center'};
        }  if (params.value == 'Passed') {
          return {color: 'white', backgroundColor: 'forestgreen', textAlign: 'center'};
        }  if (params.value == 'Unexecuted' ) {
          return {color: 'white', backgroundColor: 'royalblue', textAlign: 'center'};
        }  if (params.value == 'Blocked') {
          return {color: 'white', backgroundColor: 'orange', textAlign: 'center'};
        }  if (params.value == 'Incomplete') {
          return {color: 'black', backgroundColor: 'lightgray', textAlign: 'center'};
        }  if ( params.value == 'Untriaged') {
          return {color: 'white', backgroundColor: 'orange', textAlign: 'left'};
        }  if (params.value == 'Triaged') {
          return {color: 'black', backgroundColor: 'lightgray', textAlign: 'left'};
        } if (params.value == true) {
          return {color: 'white', backgroundColor: 'orange', textAlign: 'center'};
        }  if (params.value === false) {
          return {color: 'white', backgroundColor: 'red', textAlign: 'center'};
        }  if (params.value && (params.value.includes(': New') || params.value.includes(': Assigned') ||
             params.value.includes(': Reopened') || params.value.includes(': Deferred'))) {
          return {color: 'black', backgroundColor: 'yellow', textAlign: 'left'};
        } if (params.value && (params.value.includes(': Closed') || params.value.includes(': Resolved') )) {
          return {color: 'black', backgroundColor: 'lightgray', textAlign: 'left'};
        }  else {
            return null;
        }
      },
      // cellRenderer: function (params) {
      // if (params.value && (typeof params.value == 'string') && params.value.includes('http://')) {
      //     return `<a href='${params.value}' >${params.value}</a>` ;
      // } else if (params.colDef.field.includes('name')) {
      //     return `<a href='/Detail.html?id=${params.data.DocumentId}' target='_blank'>${params.value}</a>` ;
      // } else if (params.colDef.field.includes('DocumentId')) {
      //   return `<a href='/Triage.html?id=${params.data.DocumentId}' target='_blank'>${params.value}</a>` ;
      // } else {
      //      return params.value;}
        // },

  };

  this.getRowStyle = params => {
    if (params.node.rowIndex % 2 === 0) {
        return { background: '#f9f9f9' };
    }
  };

    this.gridOptions = {
      onGridReady: (params) =>  setTimeout(function(){
        this.gridApi = params.api,0
      }),
    };
    this.label = 'all';
  }

  ngOnInit() {
  }
  
  ngOnChanges(changes: SimpleChanges) {

    this.gridOptions = {
      // onGridReady: (params) => setTimeout(function(){
      //   this.gridApi = params.api;
      //   this.gridOptions.api.setRowData(this.rowData);
      //   this.gridOptions.api.setColumnDefs(this.columnDefs);
      //   this.gridOptions.columnApi.sizeColumnsToFit(4000);
      //   this.gridOptions.api.refreshHeader();
      //   this.gridOptions.api.refreshCells({force : true});
      //   this.gridOptions.defaultColDef = this.defaultColDef;
      //   this.gridOptions.isExternalFilterPresent  = this.isExternalFilterPresent.bind(this);
      //   this.gridOptions.doesExternalFilterPass = this.doesExternalFilterPass.bind(this), 0
      //  }),
      onGridReady: (params) => {
        this.gridApi = params.api;
        this.gridOptions.api.setRowData(this.rowData);
        this.gridOptions.api.setColumnDefs(this.columnDefs);
        this.gridOptions.columnApi.sizeColumnsToFit(4000);
        this.gridOptions.api.refreshHeader();
        this.gridOptions.api.refreshCells({force : true});
        this.gridOptions.defaultColDef = this.defaultColDef;
        this.gridOptions.defaultColDef.resizable = true;
        this.gridOptions.defaultColDef.sortable = true;
        this.gridOptions.defaultColDef.filter = true;
        // If you want to resize all columns
        // this.gridOptions.columnApi.autoSizeAllColumns();
        // this.gridOptions.columnApi.autoSizeColumns(allColumnIds);
        this.gridOptions.isExternalFilterPresent  = this.isExternalFilterPresent.bind(this);
        this.gridOptions.doesExternalFilterPass = this.doesExternalFilterPass.bind(this);
       },
      rowSelection: 'multiple',
      // enableColResize: true,
      // enableSorting: true,
      // enableFilter: true,
      enableRangeSelection: true,
      ensureDomOrder: true
    };
   if (changes.label && changes.label.currentValue != changes.label.previousValue) {
      this.externalFilterChanged(this.label);
    }
  }



  isExternalFilterPresent() {
      // if label is not 'all', then we are filtering
      return this.label != 'all';
  }

  doesExternalFilterPass(node: RowNode) {
      switch (this.label) {
          case 'Passed': return node.data.status == 'Passed';
          case 'Failed': return node.data.status == 'Failed';
          case 'Unexecuted': return node.data.status == 'Unexecuted';
          case 'Blocked': return node.data.status == 'Blocked';
          case 'Incomplete': return node.data.status == 'Incomplete';
          default: return true;
      }
  }

  externalFilterChanged(newValue) {
      if (this.gridApi) {
          this.gridApi.onFilterChanged();
      }
  }

}


