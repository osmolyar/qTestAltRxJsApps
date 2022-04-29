import { Component, OnInit, Input,Output, EventEmitter, OnChanges } from '@angular/core';
import { SELECTION_MODEL_FACTORY } from '@ng-select/ng-select';
import { SearchService } from '../../search.service';

@Component({
  selector: 'app-column-selector',
  templateUrl: './column-selector.component.html',
  styleUrls: ['./column-selector.component.css']
})
export class ColumnSelectorComponent implements OnInit, OnChanges {

  constructor(private searchService: SearchService) { }

@Input() availablefields;
@Input() selectedfields;
@Input() selected;
@Input() isProcessing;
@Input() SearchObject;

@Input() displaySearchObject;

@Output() selectedFieldsChange = new EventEmitter();
@Input() PopulateTable(searchObject) {}

ngOnInit() {
}

ngOnChanges() {
    this.selectedFieldsChange.emit(this.selectedfields);
}

createSearchObject (selectedfields, searchObject) {
  if (searchObject!=undefined) {
      this.SearchObject = searchObject;
      this.SearchObject.projection = selectedfields;

      this.PopulateTable(searchObject);
    } else {
    alert("Please define search criteria or string-based search first.")
  }
};

}
