import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-json-display',
  templateUrl: './json-display.component.html',
})
export class JsonDisplayComponent implements OnInit, OnChanges {

  constructor() { }

  display:string;
  
  @Input() json: {};
  
  ngOnInit() {
      this.display= JSON.stringify(this.json,null,4);
  }
  
  ngOnChanges() {
      this.display= JSON.stringify(this.json,null,4);
  }

}
