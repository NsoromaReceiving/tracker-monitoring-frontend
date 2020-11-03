import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitsComponent } from './units/units.component';
import { UnitComponent} from './unit/unit.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleCreateComponent } from './schedule-create/schedule-create.component';
import { LoginComponent } from './login/login.component';
import { MainAppComponent } from './main-app/main-app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ErrorPageComponent } from './error-page/error-page.component';


const routes: Routes = [
  {path: 'tracker', component: MainAppComponent, children: [
    {path: 'units', component: UnitsComponent},
    {path: 'unit/:trackerid', component: UnitComponent},
    {path: 'schedules', component: SchedulesComponent},
    {path: 'schedule/:scheduleid', component: ScheduleComponent},
    {path: 'scheduleCreate', component: ScheduleCreateComponent},
  ]},
  {path: '', redirectTo: '/tracker/units', pathMatch: 'full'},
  {path: 'index', redirectTo: 'tracker/units', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'error', component: ErrorPageComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
