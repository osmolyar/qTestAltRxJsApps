import { Component, OnInit, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { SearchService } from '../../../search.service';
import { HttpClient } from '@angular/common/http';
import { SearchFiltersComponent, ISearchObject, Ichoice } from '../../../shared/search-filters/search-filters.component';
import { ITotals } from '../../../shared/summary/summary.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, pipe } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

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
  ServerResponse: any;
  ServerResponse1: any;
  ServerResponse2: any;
  ServerResponse3: any;
  ServerResponse4: any;
  searchSubmitted: boolean;
  resultlength: number;
  indexList: [] = [];
  choices: Array<Ichoice>;

  model: IModel;
  Totals: ITotals = {};
  selectedfields: Array<string> = [
    'name',
    'runPid',
    'status',
    'defectList',
    'triageStatus',
    'TestCasePid',
    'TestCaseAssignedTo',
    'priority',
    'targetRelease',
    'environment',
    'runId',
    'testCaseId',
    'buildNumber',
    'buildZv',
    'assignedTo',
    'automationContent',
    'testCase',
    'testCycle',
    'testRun',
    'testSuite',
  ];
  // selectedfields: Array<string>;
  // availablefields: Array<string> = ['name', 'result', 'source', 'platform', 'kit', 'testSuiteGroup'];
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
    this.ServerResponse = {};
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

  makeSearch = (indexes, numDays) => {
    // this.createRestriction(indexes, numDays);
    // this.createDisplaySearchObject(this.restriction);
    // if (this.formData.length !== 0) {

    this.PopulateTable(indexes);

    // } else {
    //   alert('Please narrow your search using at least one key.');
    //   this.isProcessing = false;
    //   this.isError = true;
    // }
  };
  // #region pending
  // createDisplaySearchObject(searchObject) {
  //   this.displaySearchObject = searchObject;
  //   this.displaySearchString = JSON.stringify(this.displaySearchObject);
  // }

  // createRestriction = (indexes, numDays) => {
  //   this.formData = [];
  //   for (let value of indexes) {
  //     if (!(!value.value && value.operator !== "NOT NULL" && value.operator !== "NULL")) {
  //       // check if row contains valid condition
  //       if (value.value) {
  //         // if value is not null, convert to lower case
  //         var tuple = [value.name, value.value.toLowerCase(), value.operator];
  //       } else {
  //         // else convert null to ''
  //         var tuple = [value.name, "", value.operator];
  //       }
  //       this.formData.push(tuple);
  //       if (!JSON.stringify(this.selectedfields).includes(value.name)) {
  //         // if key is not already in display fields, add to display fields
  //         this.selectedfields.push(value.name);
  //       }
  //     }
  //   }
  //   // create restriction by combining formData and numDays.
  //   this.restriction = {
  //     restriction: this.formData,
  //     projection: this.selectedfields,
  //   };
  //   if (numDays) {
  //     this.restriction.maxDays = numDays;
  //   }
  // };

  // IsJsonString(str) {
  //   try {
  //     JSON.parse(str);
  //   } catch (e) {
  //     return false;
  //   }
  //   return true;
  // }

  // getDataFromQuery(jsonQueryObj) {
  //   this.displaySearchObject = {};
  //   this.displaySearchObject.restriction = jsonQueryObj.restriction;
  //   this.displaySearchObject.projection = jsonQueryObj.projection;
  //   this.PopulateTable(jsonQueryObj);
  // }

  // executeStringQuery = (queryObj) => {
  //   if (!this.IsJsonString(queryObj)) {
  //     this.isError = true;
  //     alert("Not a valid JSON string. Please check syntax.");
  //     return;
  //   }
  //   const jsonQueryObj: ISearchObject = eval("(" + queryObj + ")");
  //   this.selectedfields = jsonQueryObj.projection;
  //   this.availablefields = [];
  //   this.searchSubmitted = true;
  //   this.isProcessing = false;
  //   this.searchFiltersComponent.repopulateForm(jsonQueryObj);
  //   this.createDisplaySearchObject(jsonQueryObj);
  //   this.getDataFromQuery(jsonQueryObj);
  // };
  // #endregion pending

  PopulateTable = (choices) => {
    this.searchSubmitted = true;
    this.isProcessing = true;
    this.isError = false;
    this.Totals = {};
    this.label = 'all';
    console.log('choices is ' + JSON.stringify(choices));

    let query = '';
    let j = 0;
    for (const choice of choices) {
      // tslint:disable-next-line:quotemark
      if (choices[j].value || choices[j].operator === "is empty" || choices[j].operator === "is 'not empty'") {
        // tslint:disable-next-line:quotemark
        if (query.length === 0 && (choices[j].operator === "is empty" || choices[j].operator === "is 'not empty'")) {
          query = `${query} '${choices[j].name}' ${choices[j].operator}`;
          // tslint:disable-next-line:quotemark
        } else if (query.length === 0) {
          query = `${query} '${choices[j].name}' ${choices[j].operator} '${choices[j].value}'`;
          // tslint:disable-next-line:quotemark
        } else if (choices[j].operator === "is empty" || choices[j].operator === "is 'not empty'") {
          query = `${query} and '${choices[j].name}' ${choices[j].operator} `;
        } else {
          query = `${query} and '${choices[j].name}' ${choices[j].operator} '${choices[j].value}'`;
        }
      }
      j++;
    }
    console.log('query is ' + query);

    const body = {
      object_type: 'test-runs',
      fields: ['*'],
      query: query,
    };

    this.getCombinedData(body).subscribe((data) => {
      this.ServerResponse = data as { items: any };
      this.model.records = [];
      const records = [];
      if (this.ServerResponse.length === 0) {
        this.Totals.PassPercent = this.Totals.FailPercent = this.Totals.SkipPercent = this.resultlength = 0;
        this.isProcessing = false;
      } else {
        this.ServerResponse.forEach((testrun, index) => {
          records.push({});
          records[index].name = testrun.name;
          records[index].runPid = testrun.pid;

          records[index].defectList = testrun.defectList;
          records[index].status = testrun.properties.find((prop) => prop.field_name === 'Status')
            ? testrun.properties.find((prop) => prop.field_name === 'Status').field_value_name
            : '';
          records[index].TestCasePid = testrun.TestCasePid;
          records[index].triageStatus = testrun.triageStatus;
          records[index].priority = testrun.properties.find((prop) => prop.field_name === 'Priority').field_value_name;
          // records[index].lastRunStatus = testrun.latest_test_log ? testrun.latest_test_log.status : '';
          records[index].testCase = testrun.links.find((link) => link.rel === 'test-case').href;
          records[index].testCycle = testrun.links.find((link) => link.rel === 'test-cycle')
            ? testrun.links.find((link) => link.rel === 'test-cycle').href
            : '';
          records[index].testRun = testrun.links.find((link) => link.rel === 'self')
            ? testrun.links.find((link) => link.rel === 'self').href
            : '';
          records[index].TestCaseAssignedTo = testrun.TestCaseAssignedTo;
          // records[index].testCaseId = '';
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
          records[index].environment = testrun.properties.find((prop) => prop.field_name === 'Environment').field_value_name;
          records[index].buildNumber = testrun.properties.find((prop) => prop.field_name === 'Build Number')
            ? testrun.properties.find((prop) => prop.field_name === 'Build Number').field_value
            : '';
          records[index].assignedTo = testrun.properties.find((prop) => prop.field_name === 'Assigned To').field_value_name;
          records[index].buildZv = testrun.properties.find((prop) => prop.field_name === 'Build $zv')
            ? testrun.properties.find((prop) => prop.field_name === 'Build $zv').field_value
            : '';

          const testCaseUrl = testrun.links.find((link) => link.rel === 'test-case').href;
          records[index].automationContent = '';
          // there's a bug in quest here
          // records[index].testcaseId = testrun.testCaseId;
          // get test case id
          const testCaseId = testCaseUrl.substring(testCaseUrl.lastIndexOf('/') + 1, testCaseUrl.lastIndexOf('?'));
          records[index].testcaseId = testCaseId;
          records[index].TestCaseAssignedTo = testrun.TestCaseAssignedTo;
          // console.log('***testCaseId is ' + testCaseId);
          // records[index].TestCasePriority = '';
        });
        this.model.records = records;
        this.resultlength = records.length;
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
        this.Totals = {};
        this.Totals.PassPercent = this.Totals.FailPercent = this.Totals.SkipPercent = 0;
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
        this.isProcessing = false;
      }
    });
  };

  public getCombinedData(body): Observable<any> {
    let assignedTo = '';
    let automationContent = '';
    let testCasePid = '';
    let runsArray = [];
    let runIdsArray = [];
    let runIdsList = '';
    let defectArray = [];
    let defectStatus = '';
    let runStatus = '';
    let runPid = '';
    const results = [];
    // query for all test runs matching conditions
    return this.searchService.generatePostFunction(this.baseqTestApiUrl + 'projects/115545/search?pageSize=999', body).pipe(
      mergeMap((result: any) =>
        // iterate over all test runs; from creates observable stream from array of test runs
        from(result.items).pipe(
          tap((testrun: any) => {
            runStatus = testrun.properties.find((prop) => prop.field_name === 'Status')
              ? testrun.properties.find((prop) => prop.field_name === 'Status').field_value_name
              : '';
            runPid = testrun.pid;
          }),
          // get runStatus and runPid for later matching of results.  ("index" parameter of mergeMap doesn't work; always stays at 0)
          map((testrun) => ({
            ...testrun,
            status: runStatus,
            runPid: runPid,
            defectPidsArray: [],
          })),
          // For each test run, retrieve test case link to get testCasePid, Test Case Assigned To
          mergeMap((testrun: any) =>
            this.searchService.generateGetFunction(testrun.links.find((link) => link.rel === 'test-case').href).pipe(
              tap((testcase) => {
                assignedTo = testcase.properties
                  .find((prop) => prop.field_name === 'Assigned To')
                  .field_value_name.replace(/[\[\]']+/g, '');
                automationContent = testcase.properties.find((prop) => prop.field_name === 'Automation Content').field_value_name;
                testCasePid = testcase.pid;
              }),
              map(() => ({
                ...testrun,
                TestCaseAssignedTo: assignedTo,
                automationContent: automationContent,
                TestCasePid: testCasePid,
              })),
              // Put testrun into results array
              tap(() => {
                results.push(testrun);
              }),
              // Retrieve details of test case to in order to get all test runs associated with test case
              mergeMap(() =>
                this.searchService
                  .generateGetFunction(
                    this.baseqTestApiUrl + 'projects/115545/linked-artifacts?type=test-cases&ids=' + testrun.testCaseId
                  )
                  .pipe(
                    tap((response) => {
                      runsArray = response[0]
                        ? response[0].objects.filter((object) => object.link_type === 'is_associated_with')
                        : [];
                        // debugging for qTest issue with inaccurate testRunIds returned from first query
                      if (!runsArray.length) {
                        console.log('Run ids is empty.  Testcase id is ' + testrun.testCaseId);
                        console.log('Run ids is empty.  Testrun pid  is ' + testrun.pid);
                        console.log('Run ids is empty.  Testrun name  is ' + testrun.name);
                      } else {
                        runIdsArray = [];
                        runsArray.forEach((run) => runIdsArray.push(run.id));
                        runIdsList = runIdsArray.join();
                      }
                    }),
                    // Search for Linked Artifacts for runIdsList and extract defect Ids into array
                    mergeMap(() =>
                      this.searchService
                        .generateGetFunction(
                          this.baseqTestApiUrl + 'projects/115545/linked-artifacts?type=test-runs&ids=' + runIdsList
                        )
                        .pipe(
                          tap((response) => {
                            defectArray = [];
                            response.forEach((item) => {
                              const defectsArrayForRunId = item.objects.filter(
                                (object) => object.link_type === 'is_associated_with'
                              );
                              defectArray = defectArray.concat(defectsArrayForRunId);
                            });
                          }),
                          // Iterate over defect array to get defect detail and retieve defect status
                          mergeMap(() =>
                            from(defectArray).pipe(
                              tap((defect) => {
                                const defectPid = defect.pid;
                              }),
                              mergeMap((defect) =>
                                this.searchService.generateGetFunction(defect.self).pipe(
                                  tap((defectDetail: any) => {
                                    defectStatus = defectDetail.properties.find((prop) => prop.field_name === 'Status')
                                      ? defectDetail.properties.find((prop) => prop.field_name === 'Status').field_value_name
                                      : '';
                                      // Need to put this directly into corresponding result; trying to do so with a global defectPidsArray 
                                      // results in cumulative results despite reinitializing
                                    results
                                      .find((record) => record.pid === testrun.pid)
                                      .defectPidsArray.push(defectDetail.pid + ': ' + defectStatus);
                                  })
                                  // map(() => results)
                                )
                              )
                            )
                          ),
                          // Calculate triageStaus and add to corresponding result, along with defectPidsList
                          tap(() => {
                            const defectPidsList = results.find((record) => record.pid === testrun.pid).defectPidsArray.join();
                            runStatus = results.find((record) => record.pid === testrun.pid).status;
                            if (
                              runStatus === 'Failed' &&
                              defectPidsList.length &&
                              (defectPidsList.includes('New') ||
                                defectPidsList.includes('Open') ||
                                defectPidsList.includes('Assigned'))
                            ) {
                              results.find((record) => record.pid === testrun.pid).triageStatus = 'Triaged';
                            } else if (runStatus === 'Failed') {
                              results.find((record) => record.pid === testrun.pid).triageStatus = 'Untriaged';
                            }
                            results.find((record) => record.pid === testrun.pid).defectList = defectPidsList;
                          }),
                          // Return results array
                          map(() => results)
                        )
                    )
                  )
              )
            )
          )
          // map(() => results)
        )
      )
    );
  }
}
