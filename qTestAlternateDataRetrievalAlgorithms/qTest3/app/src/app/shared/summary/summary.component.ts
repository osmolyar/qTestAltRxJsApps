import { Component, OnInit, Input, OnChanges, EventEmitter, Output, SimpleChanges } from '@angular/core';

export interface ITotals {
    SkipPercent?: number;
    PassPercent?: number;
    FailPercent?: number;
    BlockPercent?: number;
    IncPercent?: number;
  }

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnChanges {
  @Input() Totals: ITotals = {};
  public pieChartLabels: string[] = ['Passed', 'Failed', 'Unexecuted', 'Blocked', 'Incomplete'];
  public pieChartData: number[];
  public pieChartType = 'pie';
  public donutChartType = 'doughnut';
  @Input() label: string;

  @Output() labelChange = new EventEmitter();

  public pieChartOptions: any = {'backgroundColor': [
            'forestgreen',
            'red',
            'royalblue',
            'orange',
            'lightgray'
            ]};

  // events on slice click
  public chartClicked(e: any): void {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
        if ( activePoints.length > 0) {
          // get the internal index of slice in pie chart
          const clickedElementIndex = activePoints[0]._index;
          this.label = chart.data.labels[clickedElementIndex];
          // get value by index
          const value = chart.data.datasets[0].data[clickedElementIndex];
          this.labelChange.emit(this.label);
        }
      }
  }

  unsetLabel = () => {
    this.label = 'all';
    this.labelChange.emit(this.label);
  }
 // event on pie chart slice hover
  public chartHovered(e: any): void {
    console.log(e);
  }
  constructor() {
    this.Totals = {};
}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.Totals) {
        this.pieChartData = [];
        // console.log("this.Totals in summary is"+ JSON.stringify(this.Totals))
        Promise.resolve(true).then(() => this.refresh());
    }
    this.labelChange.emit(this.label);
  }
  
  refresh() {
      this.pieChartData = [this.Totals.PassPercent, this.Totals.FailPercent, this.Totals.SkipPercent,
         this.Totals.BlockPercent, this.Totals.IncPercent];
      // console.log('this.pieChartData is '+ this.pieChartData);
      this.pieChartOptions = {'backgroundColor': [
        '#forestgreen',
        '#red',
        '#royalblue',
        '#orange',
        '#lightgray'
        ]};
  }
}
