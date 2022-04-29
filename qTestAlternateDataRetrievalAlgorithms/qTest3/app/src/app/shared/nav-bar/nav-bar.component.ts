import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
// import { NgOnChangesFeature } from '@angular/core/src/render3';
import { RouterModule, Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../search.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  constructor(public router: Router, private searchService: SearchService) {
  }
  query:string;
  viewType:string;
  showFilters: boolean=true;
  filters: String="Hide";

  ngOnInit() {
      this.searchService.currentView.subscribe(viewType => this.viewType = viewType);
      this.searchService.currentQuery.subscribe(query => this.query = query);
  }
  goToSearch() {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate([{ outlets: {primary: ['search']}}],{ queryParams: { "query": this.query } }));
      this.searchService.changeView("Search");
  };
  goToPivot() {
      this.router.navigate([{ outlets: {primary: ['search']}}],{ queryParams: { "query": this.query } });
      this.searchService.changeView("Platforms");
  };
  goToSource() {
      this.router.navigate([{ outlets: {primary: ['search']}}],{ queryParams: { "query": this.query } });
      this.searchService.changeView("Sources");
  };
  goToKits() {
      this.router.navigate([{ outlets: {primary: ['search']}}],{ queryParams: { "query": this.query } });
      this.searchService.changeView("Kits");
  };
  goToComparison() {
      this.router.navigate([{ outlets: {primary: ['search']}}],{ queryParams: { "query": this.query } });
      this.searchService.changeView("Kit Comparison");
  };
  goToHelp() {
      this.router.navigate([{ outlets: {primary: ['searchHelp']}}],{ queryParams: { "query": this.query } });
      this.searchService.changeView("Help");
  };
  toggleFilters() {
      this.showFilters=!this.showFilters;
      this.filters=this.showFilters ? "Hide":"Show";
      this.searchService.changeShowFilters(this.showFilters);
  };
}
