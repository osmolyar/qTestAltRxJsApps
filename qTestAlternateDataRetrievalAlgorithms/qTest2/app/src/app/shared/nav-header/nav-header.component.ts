import { Component, OnInit, Input} from '@angular/core';
import { RouterModule, Router} from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { SearchService } from '../../search.service';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent implements OnInit {

  constructor(public router: Router,private searchService: SearchService) {
  }
  @Input() header:string;
  @Input() viewType:string;
  fullHeader: string;
  
  ngOnInit() {
      this.searchService.currentView.subscribe(viewType => 
          {
              this.viewType = viewType;
              // this.fullHeader=viewType=="Help"? this.header+this.viewType : this.header+this.viewType + " View";
              this.fullHeader=this.header+this.viewType ;
      });
  }

}
