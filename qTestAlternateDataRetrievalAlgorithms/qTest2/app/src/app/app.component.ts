import { Component, NgModule, EventEmitter} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { RouterModule} from '@angular/router';
import { AppRoutingModule } from "./app-routing.module";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'search';

}
