import { Component, ElementRef, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "wbr-pivot",
    template: "<div><div class='wbr-ng-wrapper'></div></div>"
})
export class WebDataRocksPivot {
    // params
    @Input() toolbar: boolean;
    @Input() width: string | number;
    @Input() height: string | number;
    @Input() report: WebDataRocks.Report | string;
    @Input() global: WebDataRocks.Report;
    @Input() customizeCell: (cell: WebDataRocks.CellBuilder, data: WebDataRocks.Cell) => void;
    // events
    @Output() cellclick: EventEmitter<WebDataRocks.Cell> = new EventEmitter();
    @Output() celldoubleclick: EventEmitter<WebDataRocks.Cell> = new EventEmitter();
    @Output() dataerror: EventEmitter<object> = new EventEmitter();
    @Output() datafilecancelled: EventEmitter<object> = new EventEmitter();
    @Output() dataloaded: EventEmitter<object> = new EventEmitter();
    @Output() datachanged: EventEmitter<object> = new EventEmitter();
    @Output() fieldslistclose: EventEmitter<object> = new EventEmitter();
    @Output() fieldslistopen: EventEmitter<object> = new EventEmitter();
    @Output() filteropen: EventEmitter<object> = new EventEmitter();
    @Output() fullscreen: EventEmitter<object> = new EventEmitter();
    @Output() loadingdata: EventEmitter<object> = new EventEmitter();
    @Output() loadinglocalization: EventEmitter<object> = new EventEmitter();
    @Output() loadingreportfile: EventEmitter<object> = new EventEmitter();
    @Output() localizationerror: EventEmitter<object> = new EventEmitter();
    @Output() localizationloaded: EventEmitter<object> = new EventEmitter();
    @Output() openingreportfile: EventEmitter<object> = new EventEmitter();
    @Output() querycomplete: EventEmitter<object> = new EventEmitter();
    @Output() queryerror: EventEmitter<object> = new EventEmitter();
    @Output() ready: EventEmitter<WebDataRocks.Pivot> = new EventEmitter();
    @Output() reportchange: EventEmitter<object> = new EventEmitter();
    @Output() reportcomplete: EventEmitter<object> = new EventEmitter();
    @Output() reportfilecancelled: EventEmitter<object> = new EventEmitter();
    @Output() reportfileerror: EventEmitter<object> = new EventEmitter();
    @Output() reportfileloaded: EventEmitter<object> = new EventEmitter();
    @Output() runningquery: EventEmitter<object> = new EventEmitter();
    @Output() update: EventEmitter<object> = new EventEmitter();
    @Output() beforetoolbarcreated: EventEmitter<object> = new EventEmitter();
    @Output() aftergriddraw: EventEmitter<object> = new EventEmitter();
    @Output() beforegriddraw: EventEmitter<object> = new EventEmitter();
    // api
    public webDataRocks: WebDataRocks.Pivot;
    // private
    private root: HTMLElement;

    constructor(el: ElementRef) {
        this.root = <HTMLElement>el.nativeElement;
    }

    ngOnInit() {
        this.webDataRocks = window["WebDataRocks"]({
            container: this.root.getElementsByClassName("wbr-ng-wrapper")[0],
            width: this.width,
            height: this.height,
            toolbar: this.toolbar,
            report: this.report,
            global: this.global,
            customizeCell: this.customizeCell,
            cellclick: (cell: WebDataRocks.Cell) => this.cellclick.next(cell),
            celldoubleclick: (cell: WebDataRocks.Cell) => this.celldoubleclick.next(cell),
            dataerror: (event: object) => this.dataerror.next(event),
            datafilecancelled: (event: object) => this.datafilecancelled.next(event),
            dataloaded: (event: object) => this.dataloaded.next(event),
            datachanged: (event: object) => this.datachanged.next(event),
            fieldslistclose: (event: object) => this.fieldslistclose.next(event),
            fieldslistopen: (event: object) => this.fieldslistopen.next(event),
            filteropen: (event: object) => this.filteropen.next(event),
            fullscreen: (event: object) => this.fullscreen.next(event),
            loadingdata: (event: object) => this.loadingdata.next(event),
            loadinglocalization: (event: object) => this.loadinglocalization.next(event),
            loadingreportfile: (event: object) => this.loadingreportfile.next(event),
            localizationerror: (event: object) => this.localizationerror.next(event),
            localizationloaded: (event: object) => this.localizationloaded.next(event),
            openingreportfile: (event: object) => this.openingreportfile.next(event),
            querycomplete: (event: object) => this.querycomplete.next(event),
            queryerror: (event: object) => this.queryerror.next(event),
            ready: () => this.ready.next(this.webDataRocks),
            reportchange: (event: object) => this.reportchange.next(event),
            reportcomplete: (event: object) => this.reportcomplete.next(event),
            reportfilecancelled: (event: object) => this.reportfilecancelled.next(event),
            reportfileerror: (event: object) => this.reportfileerror.next(event),
            reportfileloaded: (event: object) => this.reportfileloaded.next(event),
            runningquery: (event: object) => this.runningquery.next(event),
            update: (event: object) => this.update.next(event),
            beforetoolbarcreated: (toolbar: object) => this.beforetoolbarcreated.next(toolbar),
            aftergriddraw: (event: object) => this.aftergriddraw.next(event),
            beforegriddraw: (event: object) => this.beforegriddraw.next(event)
        });
    }
}