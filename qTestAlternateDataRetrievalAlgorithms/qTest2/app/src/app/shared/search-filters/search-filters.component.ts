import { Component, OnInit, Input, AfterContentChecked, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../../search.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router';

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
  styleUrls: ['./search-filters.component.css'],
})
export class SearchFiltersComponent implements OnInit, AfterContentChecked, OnChanges {
  constructor(
    private searchService: SearchService,
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router
  ) {}
  indexList: string[] = [];
  indexes: Array<IIndex>;
  operators: { value: string; display: string }[];
  discreteOperators: { value: string; display: string }[];
  statusOperators: { value: string; display: string }[];
  statusOptions: { value: string; display: string }[];
  userOptions: string[];
  moduleOptions: string[];
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
  baseqTestApiUrl: string;
  moduleServerResponse: any;
  blank = ' ';
  query = '';
  showFilters: boolean;

  @Input() displaySearchString: string;
  @Input() displaySearchObject: ISearchObject;
  @Input() isProcessing: boolean;
  @Input() searchSubmitted: boolean;
  @Input() isError: boolean;
  @Input() resultlength: number;
  @Input() availablefields: string[];
  @Input() selectedfields: string[];
  @Input() restriction: ISearchObject;

  @Input() makeSearch(choices, numDays) {}
  @Input() executeStringQuery(data) {}
  @Input() createRestriction(indexes, numDays) {}

  ngOnInit() {
    this.searchService.currentShowFilters.subscribe((showFilters) => (this.showFilters = showFilters));
    this.searchService.currentQuery.subscribe((query) => (this.query = query));
    this.baseqTestApiUrl = 'https://isctest.qtestnet.com/api/v3/';
    this.choices = [
      { name: 'Test Case Module', operator: '=' },
      { name: 'Name', operator: '~' },
      { name: 'Status', operator: '=' },
      { name: 'Test Case Assigned To', operator: '=' },
    ];
    this.indexes = [{'Name': 'Name', 'Type': 'string'}, {'Name' : 'Status', 'Type': 'string'},
     {'Name' : 'Test Case Assigned To', 'Type': 'string'}, {'Name' : 'Test Case Module', 'Type': 'string'},
      {'Name' : 'Assigned To', 'Type': 'string'}, ];
    // this.indexList = ['Name', 'Status'];
    this.blank = '';

    this.statusOptions = [
      {
        display: 'Passed',
        value: 'Passed',
      },
      {
        display: 'Failed',
        value: 'Failed',
      },
      {
        display: 'Unexecuted',
        value: 'Unexecuted',
      },
      {
        display: 'Incomplete',
        value: 'Incomplete',
      },
      {
        display: 'Blocked',
        value: 'Blocked',
      },
    ];
    this.userOptions = ['Adrian Lewis', 'David Mietlicki', 'Jonathan Card', 'Mike Burstin', 'Olga Smolyar'];

    this.projectOptions = ['DP', 'HSPC', 'HSCV', 'HSPD', 'HSCC', 'HSIEC'];
    this.operators = [
      { value: '~', display: 'Contains' },
      { value: '=', display: 'Equal to' },
      { value: '!=', display: 'Not equal to' },
      { value: '!~', display: 'Not contains' },
      { value: 'is empty', display: 'is Empty' },
      // tslint:disable-next-line:quotemark
      { value: "is 'not empty'", display: 'is not Empty' },
      { value: '<', display: 'Less than' },
      { value: '>', display: 'Greater than' },
    ];

    this.discreteOperators = [
      { value: '=', display: 'Equal to' },
      { value: '!=', display: 'Not equal to' },
      { value: 'is empty', display: 'is Empty' },
      // tslint:disable-next-line:quotemark
      { value: "is 'not empty'", display: 'is not Empty' }
    ];

    this.statusOperators = [
      { value: '=', display: 'Equal to' },
      { value: '!=', display: 'Not equal to' }
    ];

    this.searchService.generateGetFunction(this.baseqTestApiUrl + 'projects/115545/modules?expand=descendants').subscribe(
      (data) => {
        this.moduleOptions = [];
        this.moduleServerResponse = data;
        const flattened = [];

        function flatten(myArray, outputArray) {
          myArray.forEach(function (element) {
            if (element.hasOwnProperty('children')) {
              flatten(element.children, outputArray);
            } else {
              outputArray.push(element);
            }
          });
        }

        flatten(this.moduleServerResponse, flattened);
        flattened.forEach((module) => {
          this.moduleOptions.push(module.pid + ' ' + module.name);
        });
      },
      (error) => {
        alert('There was an error loading modules list');
      }
    );

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
  }

  ngAfterContentChecked() {}

  ngOnChanges() {}

  repopulateForm(jsonQueryObj) {
    this.choices = [];
    // this.numDays = jsonQueryObj.maxDays;
    const queryArray = jsonQueryObj.split('and');
    const separators = ['!=', '!~', '=', '~', '<', '>'];
    queryArray.forEach((clause) => {
      // separator group used as delimiters will cause delimiters to be returned as part of output
      const tokens = clause.split(new RegExp('([' + separators.join('') + '])'));​​​​​​​​​​​​​​​​​
      console.log('tokens is ' + tokens);
      if (!clause.includes('empty')) {
        this.choices.push({
          name: tokens[0].replace(/ \'/g, '').replace(/\' /g, '').replace(/\'/g, ''),
          operator: tokens[1],
          value: tokens[2].replace(/ \'/g, '').replace(/\' /g, '').replace(/\'/g, ''),
       });
      } else if (clause.includes('not')) {
        const notEmptyToken = clause.split('is')[0];
        this.choices.push({
          name: notEmptyToken.replace(/ \'/g, '').replace(/\' /g, '').replace(/\'/g, ''),
          // tslint:disable-next-line:quotemark
          operator: "is 'not empty'",
        });
      } else {
        const emptyToken = clause.split('is')[0];
        this.choices.push({
          name: emptyToken.replace(/ \'/g, '').replace(/\' /g, '').replace(/\'/g, ''),
          operator: 'is empty',
        });
      }
    });
  }

  refreshSavedSearches() {
    this.searchService.generateGetFunction('/api/trdb/queries').subscribe(
      (data) => {
        this.savedSearches = data as Array<string>;
      },
      (error) => {
        alert('There was an error loading saved searches');
      }
    );
  }

  saveSearch(name, indexes, numDays) {
    this.createRestriction(indexes, numDays);
    this.displaySearchObject = this.restriction;
    this.displaySearchObject.projection = this.selectedfields;
    this.displaySearchString = JSON.stringify(this.displaySearchObject);
    const query = this.displaySearchString;
    this.router.navigate([{ outlets: { primary: ['search'] } }], { queryParams: { query: name } });
    this.query = name;
    this.searchService.changeQuery(this.query);
    const data = { name, query };
    this.searchService.generatePostFunction('/api/trdb/queries', data).subscribe(
      () => {
        this.refreshSavedSearches();
      },
      function myError(response) {
        alert('There was an error saving the search ' + response);
      }
    );
  }

  loadSearch(name) {
    this.searchService.generateGetFunction('/api/trdb/queries/' + name.name).subscribe(
      (data) => {
        this.savedSearchName = name.name;
        this.router.navigate([{ outlets: { primary: ['search'] } }], { queryParams: { query: name.name } });
        this.query = name.name;
        this.searchService.changeQuery(this.query);
        this.executeStringQuery(JSON.stringify(data));
      },
      function myError(data) {
        alert('There was an error loading saved search');
      }
    );
  }

  // loadUrlSearch = (name) => {
  //   this.searchService.generateGetFunction('/api/trdb/queries/' + name).subscribe(
  //     (data) => {
  //       this.savedSearchName = name;
  //       this.loadSearchName = name;
  //       this.executeStringQuery(JSON.stringify(data));
  //     },
  //     function myError(data) {
  //       alert('There was an error loading saved search');
  //     }
  //   );
  // }

  loadUrlSearch = (query) => {
    this.executeStringQuery(query);
  }

  addNewChoice = () => {
    this.choices.push({ name: 'Name', operator: '=' });
  }

  removeChoice(index) {
    if (this.choices.length > 1) {
      this.choices.splice(index, 1);
    } else {
      alert('Cannot remove last filter');
    }
  }
}
