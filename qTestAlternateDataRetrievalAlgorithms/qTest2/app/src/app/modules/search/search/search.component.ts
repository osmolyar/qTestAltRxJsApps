import { Component, OnInit, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { SearchService } from '../../../search.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchFiltersComponent, ISearchObject, Ichoice } from '../../../shared/search-filters/search-filters.component';
import { ITotals } from '../../../shared/summary/summary.component';
import { RouterModule, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SELECT_PANEL_INDENT_PADDING_X } from '@angular/material';
import { concatMap, tap, toArray, map, mergeMap } from 'rxjs/operators';
import { forkJoin, from, Observable, of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';


interface IModel {
  records?;
  columns?: String[];
  columnDefsForGrid?: Array<IColumns>;
}

interface IColumns {
  headerName: String;
  field: String;
}

interface IServerResponse {
  Totals?: ITotals;
  availableColumns?: [];
  Data?: [];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, AfterViewInit {
  @ViewChild(SearchFiltersComponent)
  searchFiltersComponent: SearchFiltersComponent;

  isProcessing: boolean;
  isError: boolean;
  searchSubmitted: boolean;
  resultlength: number;
  indexList: [] = [];
  choices: Array<Ichoice>;

  model: IModel;
  Totals: ITotals = {};
  selectedfields: Array<string> = ['name', 'runPid', 'status', 'defectList', 'triageStatus',
   'TestCasePid', 'TestCaseAssignedTo', 'executionEnd', 'priority', 'targetRelease', 'environment',
  'runId', 'testCaseId', 'buildNumber', 'buildZv', 'assignedTo', 'automationContent',
   'testCase', 'testCycle', 'testRun', 'testSuite' ];
  availablefields: Array<string>;
  displaySearchObject: ISearchObject;
  displaySearchString: string;

  formData: Array<Array<string>>;
  numDays: number;
  restriction: ISearchObject;
  label = 'all';
  query: string;
  baseqTestApiUrl: string;
  baseJiraApiUrl: string;

  viewType: string;
  showFilters: boolean;

  constructor(
    private http: HttpClient,
    private searchService: SearchService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.searchService.currentView.subscribe((viewType) => (this.viewType = viewType));
  }

  ngOnInit() {
    this.baseqTestApiUrl = 'https://isctest.qtestnet.com/api/v3/';
    this.baseJiraApiUrl = 'https://sbjira.iscinternal.com/rest/api/2/';
    this.isProcessing = false;
    this.isError = false;
    this.model = {};
    this.model.columns = [];
    this.model.records = [];
    this.query = this.route.snapshot.queryParams.query;
    this.searchService.changeQuery(this.query);
    this.searchService.currentView.subscribe((viewType) => (this.viewType = viewType));
    this.searchService.currentShowFilters.subscribe((showFilters) => (this.showFilters = showFilters));
    this.query = this.route.snapshot.queryParams.query;
    this.choices = [
      { name: 'project', operator: '=', value: 'DP' },
      { name: 'folder', operator: '=' },
    ];
  }
  ngAfterViewInit() {
    if (this.query) {
      this.searchFiltersComponent.loadUrlSearch(this.query);
    }
    this.Totals = {};
  }

  makeSearch = (choices, numDays) => {
   const body = this.createBody(choices, numDays);
   this.PopulateTable(body);
  }

  createBody = (choices, numDays) => {
    let query = '';
    // this.checkChoices(choices);
    choices.forEach((choice) => {
      // tslint:disable-next-line:quotemark
      if (choice.value || choice.operator === "is empty" || choice.operator === "is 'not empty'") {
        // tslint:disable-next-line:quotemark
        if (query.length === 0 && (choice.operator === "is empty" || choice.operator === "is 'not empty'")) {
          query = `'${choice.name}' ${choice.operator}`;
          // tslint:disable-next-line:quotemark
        } else if (query.length === 0) {
          query = `'${choice.name}' ${choice.operator} '${choice.value}'`;
          // tslint:disable-next-line:quotemark
        } else if (choice.operator === "is empty" || choice.operator === "is 'not empty'") {
          query = `${query} and '${choice.name}' ${choice.operator} `;
        } else {
          query = `${query} and '${choice.name}' ${choice.operator} '${choice.value}'`;
        // if (!JSON.stringify(this.selectedfields).includes(choice.name)) {
        //   this.selectedfields.push(choice.name);
        //  }
        }
      }
    });

    // Get date numDays ago
    if (numDays && (numDays > 0)) {
      const newDate  = Date.now() + -numDays * 24 * 3600 * 1000;
      const numDaysAgo = new Date(newDate).toISOString();
      query = `${query} and 'Executed End' > '${numDaysAgo}'`;
    }

    console.log('query is ' + query);
    const body = {
      object_type: 'test-runs',
      fields: ['*'],
      query: query,
    };
    return body;
  }

  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  getDataFromQuery(query) {
    const body = {
      object_type: 'test-runs',
      fields: ['*'],
      query: query,
    };
    this.PopulateTable(body);
  }

  executeStringQuery = (queryObj) => {
    if (!this.IsJsonString(queryObj)) {
      this.isError = true;
      alert('Not a valid JSON string. Please check syntax.');
      return;
    }
    // tslint:disable-next-line:no-eval
    const jsonQueryObj: ISearchObject = eval('(' + queryObj + ')');
    this.searchSubmitted = true;
    this.isProcessing = false;
    this.searchFiltersComponent.repopulateForm(jsonQueryObj);
    this.getDataFromQuery(jsonQueryObj);
  }

  PopulateTable = (body) => {
    this.searchSubmitted = true;
    this.isProcessing = true;
    this.isError = false;
    this.Totals = {};
    this.label = 'all';
    this.displaySearchString = JSON.stringify(body.query);
    this.router.navigate([{ outlets: {} }], { queryParams: { query: JSON.stringify(body.query) } });

    this.getCombinedData(body).subscribe(
      (records) => {
        this.model.records = [];
        this.model.records = records;
        this.resultlength = records.length;
        this.Totals = {};
        if (this.resultlength === 0) {
          this.Totals.PassPercent = this.Totals.FailPercent = this.Totals.SkipPercent = 0;
        } else {
        const totalCount = records.length;
        const passCount = records.filter((obj) => obj.status === 'Passed').length;
        const failCount = records.filter((obj) => obj.status === 'Failed').length;
        const skipCount = records.filter((obj) => obj.status === 'Unexecuted').length;
        const blockCount = records.filter((obj) => obj.status === 'Blocked').length;
        const incompleteCount = records.filter((obj) => obj.status === 'Incomplete').length;
        this.Totals.PassPercent = (passCount / totalCount) * 100;
        this.Totals.FailPercent = (failCount / totalCount) * 100;
        this.Totals.SkipPercent = (skipCount / totalCount) * 100;
        this.Totals.BlockPercent = (blockCount / totalCount) * 100;
        this.Totals.IncPercent = (incompleteCount / totalCount) * 100;
        this.availablefields = Object.keys(this.model.records[0]).sort(function (a: string, b: string) {
          return a.localeCompare(b);
        });
        this.model.columns = Object.keys(this.model.records[0]);
        const columns: Array<IColumns> = [];
        for (let i = 0; i < this.model.columns.length; i++) {
          if (JSON.stringify(this.selectedfields).includes(JSON.stringify(this.model.columns[i]))) {
            columns.push({
              headerName: this.model.columns[i],
              field: this.model.columns[i],
            });
          }
        }
        this.model.columnDefsForGrid = columns;
        this.searchService.changeRowData(this.model.records);
      }
        this.isProcessing = false;
      },
      (error) => {
        this.isProcessing = false;
        this.isError = true;
        const err = error;
        if (err.data === '') {
          alert('Gateway timeout while retrieving records. Please narrow your search.');
          return err;
        } else {
          alert('Error: ' + JSON.stringify(err));
        }
      }
    );
  }

  public getCombinedData(body): Observable<any> {
    const assignedTo = '';
    let testCaseUrl = '';
    const records = [];
    // query for all test runs matching conditions
    return this.searchService
    .generatePostFunction(this.baseqTestApiUrl + 'projects/115545/search?pageSize=999', body).pipe(
      tap((testruns_data) => {
        if (testruns_data.items.length === 0) {
            this.Totals.PassPercent = this.Totals.FailPercent = this.Totals.SkipPercent = this.resultlength = 0;
            this.isProcessing = false;
          } else {
            // iterate over all test runs
            testruns_data.items.forEach((testrun, index) => {
              records.push({});
              records[index].name = testrun.name;
              records[index].runPid = testrun.pid;
              records[index].defectList = '';
              records[index].status = testrun.properties.find((prop) => prop.field_name === 'Status')
                ? testrun.properties.find((prop) => prop.field_name === 'Status').field_value_name
                : '';
              records[index].TestCasePid = '';
              if (records[index].status === 'Failed') {
                records[index].triageStatus = 'Untriaged';
              } else {
                records[index].triageStatus = '';
              }
              records[index].priority = testrun.properties.find(
                (prop) => prop.field_name === 'Priority'
              ).field_value_name;
              // records[index].lastRunStatus = testrun.latest_test_log ? testrun.latest_test_log.status : '';
              records[index].testCase = testrun.links.find((link) => link.rel === 'test-case').href;
              records[index].testCycle = testrun.links.find((link) => link.rel === 'test-cycle')
              ? testrun.links.find((link) => link.rel === 'test-cycle').href
              : '';
              records[index].testRun = testrun.links.find((link) => link.rel === 'self')
              ? testrun.links.find((link) => link.rel === 'self').href
              : '';
              records[index].TestCaseAssignedTo = '';
              records[index].executionEnd = testrun.latest_test_log ? testrun.latest_test_log.exe_end_date.substring(0, 19) : '';
              records[index].testCaseId = '';
              records[index].runId = testrun.id;
              records[index].testSuite = testrun.links.find((link) => link.rel === 'test-suite')
                ? testrun.links.find((link) => link.rel === 'test-suite').href
                : '';
              records[index].targetRelease = testrun.properties.find(
                (prop) => prop.field_name === 'Target Release/Build'
              ).field_value_name;
              records[index].buildVersion = testrun.properties.find((prop) => prop.field_name === 'Build Version')
                ? testrun.properties.find((prop) => prop.field_name === 'Build Version').field_value_name
                : '';
              records[index].environment = testrun.properties.find(
                (prop) => prop.field_name === 'Environment'
              ).field_value_name;
              records[index].buildNumber = testrun.properties.find((prop) => prop.field_name === 'Build Number')
                ? testrun.properties.find((prop) => prop.field_name === 'Build Number').field_value
                : '';
              records[index].assignedTo = testrun.properties.find(
                (prop) => prop.field_name === 'Assigned To'
              ).field_value_name;
              records[index].buildZv = testrun.properties.find((prop) => prop.field_name === 'Build $zv')
                ? testrun.properties.find((prop) => prop.field_name === 'Build $zv').field_value
                : '';

              testCaseUrl = testrun.links.find((link) => link.rel === 'test-case').href;
              records[index].automationContent = '';
               // records[index].testcaseId = testrun.testCaseId;
              // get test case id
              const testCaseId = testCaseUrl.substring(testCaseUrl.lastIndexOf('/') + 1, testCaseUrl.lastIndexOf('?'));
              records[index].testcaseId = testCaseId;
              // console.log('***testCaseId is ' + testCaseId);
              // records[index].TestCasePriority = '';

              // For each test run, retrieve test case link to get testCasePid, Test Case Assigned To
              this.searchService
                .generateGetFunction(testCaseUrl).pipe(
                  tap((testcase_record) => {
                    records.find((record) => record.runPid === testrun.pid).TestCaseAssignedTo = testcase_record.properties.find(
                      (prop) => prop.field_name === 'Assigned To'
                    ).field_value_name.replace(/[\[\]']+/g, '');
                    records.find((record) => record.runPid === testrun.pid).automationContent = testcase_record.properties.find(
                      (prop) => prop.field_name === 'Automation Content'
                    ).field_value_name;
                    // records.find((record) => record.runPid === testrun.pid).TestCasePriority = this.ServerResponse4.properties.find(
                    //   (prop) => prop.field_name === 'Priority'
                    // ).field_value_name;
                    records.find((record) => record.runPid === testrun.pid).TestCasePid = testcase_record.pid;
                    records[index].TestCasePid = testcase_record.pid;
                  }),
                  map(() => records)
                ).subscribe();
              // Retrieve details of test case to in order to get all test runs associated with test case
              this.searchService
                .generateGetFunction(this.baseqTestApiUrl + 'projects/115545/linked-artifacts?type=test-cases&ids=' + testrun.testCaseId)
                .pipe(
                  tap((testcase_detail) => {
                  const runsArray = testcase_detail[0]
                    ? testcase_detail[0].objects.filter((object) => object.link_type === 'is_associated_with')
                    : [];
                  if (!runsArray.length) {
                    console.log('Run ids is empty.  Testcase id is ' + testCaseId);
                    console.log('Run ids is empty.  Testrun pid  is ' + testrun.pid);
                    console.log('Run ids is empty.  Testrun name  is ' + testrun.name);
                  } else {
                  const runIdsArray = [];
                  runsArray.forEach((run) => runIdsArray.push(run.id));
                  const runIdsList = runIdsArray.join();
                   // Search for Linked Artifacts for runIdsList and extract defect Ids into array
                  this.searchService
                    .generateGetFunction(
                      this.baseqTestApiUrl + 'projects/115545/linked-artifacts?type=test-runs&ids=' + runIdsList
                    )
                    .pipe(
                      tap((associated_testruns_detail) => {
                      const defectPidsArray = [];
                      let defectPidsList = '';
                      associated_testruns_detail.forEach((item) => {
                        const defectArray = item.objects.filter((object) => object.link_type === 'is_associated_with');
                        // Iterate over defect array to get defect detail and retieve defect status
                        defectArray.forEach((defect) => {
                          const defectPid = defect.pid;
                          let defectStatus = '';
                          this.searchService.generateGetFunction(defect.self).pipe(
                            tap((defect_detail) => {
                            defectStatus = defect_detail.properties.find((prop) => prop.field_name === 'Status')
                              ? defect_detail.properties.find((prop) => prop.field_name === 'Status').field_value_name
                              : '';
                            defectPidsArray.push(defectPid + ': ' + defectStatus);
                            defectPidsList = defectPidsArray.join();
                            const runStatus = records.find((record) => record.runPid === testrun.pid).status;
                            if (
                              runStatus === 'Failed' &&
                              defectPidsList.length &&
                              (defectPidsList.includes('New') ||
                                defectPidsList.includes('Open') ||
                                defectPidsList.includes('Assigned'))
                            ) {
                              records.find((record) => record.runPid === testrun.pid).triageStatus = 'Triaged';
                            } else if (runStatus === 'Failed') {
                              records.find((record) => record.runPid === testrun.pid).triageStatus = 'Untriaged';
                            }
                            records.find((record) => record.runPid === testrun.pid).defectList = defectPidsList;
                            records[index].defectList = defectPidsList;
                            // Repopulate array for display grid after retrieving triage details
                            this.model.records = records;
                            this.model.columns = Object.keys(this.model.records[0]);
                            const columns: Array<IColumns> = [];
                            for (let i = 0; i < this.model.columns.length; i++) {
                              if (JSON.stringify( this.selectedfields ).includes(JSON.stringify(this.model.columns[i]))) {
                              columns.push({
                                headerName: this.model.columns[i],
                                field: this.model.columns[i],
                              });
                            }
                            }
                            this.model.columnDefsForGrid = columns;
                            this.searchService.changeRowData(this.model.records);
                          }),
                          tap(() => {
                            // Populate array for display grid
                            this.model.records = records;
                            this.model.columns = Object.keys(this.model.records[0]);
                            const columns: Array<IColumns> = [];
                            for (let i = 0; i < this.model.columns.length; i++) {
                              if (JSON.stringify( this.selectedfields ).includes(JSON.stringify(this.model.columns[i]))) {
                              columns.push({
                                headerName: this.model.columns[i],
                                field: this.model.columns[i],
                              });
                            }
                            }
                            this.model.columnDefsForGrid = columns;
                            this.searchService.changeRowData(this.model.records);
                          }),
                          map(() => records)
                          ).subscribe();
                        });
                      });
                    }),
                    ).subscribe();
                }
              }),
              ).subscribe();
            });
          }
        }),
        map(() => records)
    );
  }

}
