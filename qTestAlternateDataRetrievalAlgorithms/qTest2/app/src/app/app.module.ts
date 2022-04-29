import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { Component,  EventEmitter} from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { HttpHeaders} from '@angular/common/http';

import { SearchModule } from './modules/search/search.module';
import { SharedModule } from './shared/shared.module';
import { WebDataRocksModule } from './webdatarocks/src/app/app.module';

import { SearchService } from './search.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    SearchModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
