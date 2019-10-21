import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';

import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { UnitsComponent } from './units/units.component';
import { UnitComponent } from './unit/unit.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleCreateComponent } from './schedule-create/schedule-create.component';

@NgModule({
  declarations: [
    AppComponent,
    UnitsComponent,
    UnitComponent,
    SchedulesComponent,
    ScheduleComponent,
    ScheduleCreateComponent
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
    MatIconModule,
    MatStepperModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDQTpXj82d8UpCi97wzo_nKXL7nYrd4G70'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
