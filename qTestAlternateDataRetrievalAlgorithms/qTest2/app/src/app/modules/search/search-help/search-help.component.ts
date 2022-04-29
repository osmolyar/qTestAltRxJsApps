import { Component, OnInit} from '@angular/core';
import { NgOnChangesFeature } from '@angular/core/src/render3';
import { RouterModule, Router} from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { SearchService } from '../../../search.service';



@Component({
  selector: 'app-search-help',
  templateUrl: './search-help.component.html',
  styleUrls: ['./search-help.component.css']
})
export class SearchHelpComponent implements OnInit {

    sampleDoc: {};
    query:string;
    rowData;

  constructor(public router: Router, private searchService: SearchService) {
      this.sampleDoc={
              "UnitTestRoot": "/autoinstall/IRISX201910B506XSNB/p4-test-IRIS2019.1.0/",
              "unicode": 1,
              "zv": "IRIS for UNIX (Red Hat Enterprise Linux for x86-64) 2019.1",
              "build": "506",
              "version": "2019.1",
              "platform": "Red Hat Enterprise Linux for x86-64",
              "testsys": 0,
              "Ensemble": 1,
              "HealthShare": 0,
              "host": "qdvmlnxrhx64c",
              "instance": "IRISX201910B506XSNB",
              "OS": "UNIX",
              "namespace": "USER",
              "installDirectory": "/autoinstall/IRISX201910B506XSNB/",
              "cores": 2,
              "buildTime": 73337,
              "buildDate": 65058,
              "bigEndian": 0,
              "kit": "2019.1.0.506",
              "source": "autf2",
              "comment": "Smoke test of iris ",
              "codeName": "IRIS2019.1.0",
              "frameworkKit": "2019.1.0.506.0",
              "syncList": "IRIS2019.1.0",
              "logFolder": "/qdnet1/quality/HSAUTF/logs/qdvmlnxrhx64c.IRIS2019.1.0.506",
              "product": "IRIS",
              "cplatname": "lnxrhx64",
              "kitPath": "/kitserver/kits/unreleased/IRIS/2019.1.0/2019.1.0.506.0/...",
              "name": "Smoke.JDBC",
              "directory": "buildRegression\\jdbc",
              "time": 6.035477,
              "result": 1,
              "testcases": [],
              "uploadDate": 65058,
              "id": "7978463"
          }
    };

  
  ngOnInit() {
      this.searchService.currentQuery.subscribe(query => this.query = query);
      this.searchService.currentRowData.subscribe(rowData => this.rowData = rowData);
  }
}
