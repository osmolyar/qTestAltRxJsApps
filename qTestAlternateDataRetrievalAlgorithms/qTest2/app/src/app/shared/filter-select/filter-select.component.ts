import { Component, OnInit, Input,OnChanges} from '@angular/core';
import { Ichoice, IIndex} from '../search-filters/search-filters.component';

@Component({
  selector: 'app-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.css']
})
export class FilterSelectComponent implements OnInit, OnChanges {

 constructor() {
  }

 @Input() options: string[];
 @Input() choice: Ichoice;
 @Input() name: string;
 @Input() disabled: boolean;
 blank = ' ';

  ngOnInit() {
  };

  ngOnChanges() {
      this.disabled=this.disabled;
  }

}
