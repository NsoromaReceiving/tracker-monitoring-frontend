import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { UnitsComponent } from './units/units.component';
import { UnitComponent } from './unit/unit.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleCreateComponent } from './schedule-create/schedule-create.component';
import { LoginComponent } from './login/login.component';
import { MainAppComponent } from './main-app/main-app.component';
import { CookieService } from 'ngx-cookie-service';
import { ApHttpInterceptorService } from './ap-http-interceptor.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';

@NgModule({
  declarations: [
    AppComponent,
    UnitsComponent,
    UnitComponent,
    SchedulesComponent,
    ScheduleComponent,
    ScheduleCreateComponent,
    LoginComponent,
    MainAppComponent,
    PageNotFoundComponent,
    ServerErrorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDQTpXj82d8UpCi97wzo_nKXL7nYrd4G70'
    })
  ],
  providers: [CookieService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApHttpInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
