import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WebDataRocksPivot } from "./webdatarocks/webdatarocks.angular4";


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent, WebDataRocksPivot
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    AppComponent, WebDataRocksPivot
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class WebDataRocksModule { }
