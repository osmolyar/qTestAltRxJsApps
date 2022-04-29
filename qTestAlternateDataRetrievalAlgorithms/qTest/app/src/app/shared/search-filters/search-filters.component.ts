import { Component, OnInit, Input, AfterContentChecked, OnChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { SearchService } from '../../search.service';
import { ActivatedRoute } from "@angular/router";
import { RouterModule, Router} from '@angular/router';

import * as jQuery from 'jquery';
declare let $: JQueryStatic;

export interface IIndex {
  Name: string;
  Type: string;
}

export interface Ichoice {
  name: string;
  operator: string;
  value?: string;
}

interface Isearch {
    name: string;
    search: {};
  }

export interface ISearchObject {
  restriction?: Array<Array<string>>;
  maxDays?: number;
  newKeys?: Array<Array<string>>;
  projection?: Array<string>;
}

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.css']
})
export class SearchFiltersComponent implements OnInit, AfterContentChecked, OnChanges {


 constructor(private searchService: SearchService, private http:HttpClient,private route: ActivatedRoute, public router: Router) {

  }
   indexList: string[] = [];
   indexes: Array<IIndex>;
   operators: { value: string, display: string }[];
   resultOptions: { value: string, display: string }[];
   kitOptions: string[];
   folderOptions: string[];
   projectOptions: string[];
   sourceOptions: string[];
   platformOptions: string[];
   testSuiteGroupOptions: string[];
   @Input() choices: Array<Ichoice>;
   numDays: number;
   savedSearches: string[];
   savedSearchName: string;
   customKey: string;
   savedSearchString: string;
   loadSearchName: string;
   blank = ' ';
   query: string="";

  @Input() displaySearchString: string;
  @Input() displaySearchObject: ISearchObject;
  @Input() isProcessing: boolean;
  @Input() searchSubmitted: boolean;
  @Input() isError: boolean;
  @Input() resultlength: number;
  @Input() availablefields: string[];
  @Input() selectedfields: string[];
  @Input() restriction: ISearchObject;

  @Input() makeSearch (choices, numDays) {}
  @Input() executeStringQuery(data) {}
  @Input() createRestriction(indexes, numDays) {}
  showFilters: boolean;


  ngOnInit() {
      this.searchService.currentShowFilters.subscribe(showFilters => this.showFilters = showFilters);
      this.searchService.currentQuery.subscribe(query => this.query = query);
	  this.choices = [
		{'name': 'project', 'operator': '='}, {'name': 'folder', 'operator': '='}];
		this.indexes = [{'Name': 'folder', 'Type': 'string'}, {'Name' : 'project', 'Type': 'string'}];
		this.indexList = ['folder', 'project'];
   this.blank =  '';

   

   this.resultOptions = [
      {
        display: 'PASS',
        value: '1'
      },
      {
        display: 'FAIL',
        value: '0',
      },
      {
        display: 'SKIP',
        value: '2'
      },
    ];
	this.folderOptions = [
		'IRIS',  'SeaLand', '/IRIS/2021', '/IRIS/2021/2021.0', '/IRIS/2021/2021.0/2021.0.0L',
		'/IRIS/2021/2021.0/2021.0.0SQL', '/IRIS/2021/2021.0/2021.0.0', '/IRIS/2021/2021.1', '/IRIS/2021/2021.1/2021.1.0', '/IRIS/2021/2021.2',
		'/IRIS/2021/2021.3', '/IRIS/2021/2021.3/2021.3.0L', '/IRIS/2021/2021.3/2021.3.0SQL'
		, '/IRIS/2022', '/IRIS/2022/2022.1', '/IRIS/2022/2022.0/2021.0.0SQL', 'IRISHealth',
		 'HealthConnect', 'SAM'
	 ];
	 this.projectOptions = [
		'DP', 'HSPC', 'HSCV', 'HSPD', 'HSCC', 'HSIEC'
	 ];
    this.operators = [
      {'value': '%STARTSWITH', 'display': 'Starts with'},
      {'value': '=', 'display': 'Equal to'},
      {'value': '!=', 'display': 'Not equal to'},
      {'value': '<', 'display': 'Less than'},
      {'value': '>', 'display': 'Greater than'},
      {'value': 'NULL', 'display': 'Null'},
      {'value': 'NOT NULL', 'display': 'Not null'}
      ];

		// this.searchService.generateGetFunction('/api/trdb/results/indexes')
		// .subscribe(data => {
		// 	this.indexes = data as Array<IIndex>;
		// 	for (let i = 0; i < this.indexes.length; i++)
		// 	{
		// 		this.indexList.push(this.indexes[i].Name)
		// 	}
		// 	this.searchSubmitted = false;
		// }, error =>
		// {
		// 	alert('There was an error loading initial indexes');
		// });

		// this.searchService.generateGetFunction('/api/trdb/results/uniqueValues/kit')
		// .subscribe(data => {
		// 	this.kitOptions = data as [];
		// }, error =>  {
		// 	alert('There was an error loading initial indexes');
		// });

		// this.searchService.generateGetFunction('/api/trdb/results/uniqueValues/source')
		// .subscribe(data => {
		// 	this.sourceOptions = data as [];
		// }, error => {
		// 	alert('There was an error loading initial indexes');
		// });

		// this.searchService.generateGetFunction('/api/trdb/results/uniqueValues/platform')
		// .subscribe(data => {
		// 	this.platformOptions = data as [];
		// }, error => {
		// 	alert('There was an error loading initial indexes');
		// });

		// this.searchService.generateGetFunction('/api/trdb/results/uniqueValues/testSuiteGroup')
		// .subscribe(data => {
		// 	this.testSuiteGroupOptions = data as [];
		// }, error => {
		// 	alert('There was an error loading initial indexes');
		// });

	// this.refreshSavedSearches();
    // if (this.query) {
    //     this.searchService.generateGetFunction('/api/trdb/queries/' +this.query)
    //     .subscribe(data => {
    //         this.savedSearchName=this.query;
    //         this.loadSearchName=this.query;
    //         this.repopulateForm(data);
    //     }, function myError(data) {
    //         alert('There was an error loading saved search');
    //     });
    // } 
  };

  ngAfterContentChecked() {
  }

  ngOnChanges() {
  }
  
	repopulateForm (jsonQueryObj) {
		this.choices=[];
		this.restriction=jsonQueryObj;
		for (let i = 0; i < jsonQueryObj.restriction.length; i++) {
			if (!JSON.stringify(this.indexList).includes(jsonQueryObj.restriction[i][0])) {
				this.indexes.push({'Name':jsonQueryObj.restriction[i][0],'Type':'String'});
			}
			this.choices.push({'name':jsonQueryObj.restriction[i][0],'value':String(jsonQueryObj.restriction[i][1]),'operator':jsonQueryObj.restriction[i][2]})
		}
		this.numDays=jsonQueryObj.maxDays;;
  }

  refreshSavedSearches() {
		this.searchService.generateGetFunction('/api/trdb/queries')
		.subscribe(data => {
			this.savedSearches = data as Array<string>;
		}, error => {
			alert('There was an error loading saved searches');
		});
	}

	saveSearch(name, indexes, numDays) {
		this.createRestriction(indexes, numDays);
		this.displaySearchObject = this.restriction;
		this.displaySearchObject.projection=this.selectedfields;
		this.displaySearchString=JSON.stringify(this.displaySearchObject);
		let query=this.displaySearchString;
		this.router.navigate([{ outlets: {primary: ['search']}}],{ queryParams: { "query": name } });
		this.query=name;
		this.searchService.changeQuery(this.query);
		let data={name,query};
		this.searchService.generatePostFunction('/api/trdb/queries',data)
		.subscribe(data => {
			this.refreshSavedSearches();
		}, function myError(response) {
			alert('There was an error saving the search '+response);
		});
	}

	loadSearch(name) {
		this.searchService.generateGetFunction('/api/trdb/queries/' +name.name)
		.subscribe(data => {
			this.savedSearchName=name.name;
			this.router.navigate([{ outlets: {primary: ['search']}}],{ queryParams: { "query": name.name } });
			this.query=name.name;
			this.searchService.changeQuery(this.query);
			this.executeStringQuery(JSON.stringify(data));
			
		}, function myError(data) {
			alert('There was an error loading saved search');
		});
}

	loadUrlSearch = ( name ) => {
	    this.searchService.generateGetFunction( '/api/trdb/queries/' + name )
	    .subscribe( data => {
	        this.savedSearchName = name;
	        this.loadSearchName = name;
	        this.executeStringQuery( JSON.stringify( data ) );
	    }, function myError( data ) {
	        alert( 'There was an error loading saved search' );
	    });
	}

	addNewChoice = () => {
	    this.choices.push( { 'name': 'kit', operator: '=' } );
	};

	removeChoice(index) {
		if(this.choices.length>1)
		{
			this.choices.splice(index,1)
		}
		else {
			alert('Cannot remove last filter');
		}
	};

}
