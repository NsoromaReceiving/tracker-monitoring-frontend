import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitsComponent } from './units/units.component';
import { UnitComponent} from './unit/unit.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleCreateComponent } from './schedule-create/schedule-create.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {path: '', redirectTo: '/units', pathMatch: 'full'},
  {path: 'index', redirectTo: '/units', pathMatch: 'full'},
  {path: 'units', component: UnitsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'unit/:trackerid', component: UnitComponent},
  {path: 'schedules', component: SchedulesComponent},
  {path: 'schedule/:scheduleid', component: ScheduleComponent},
  {path: 'scheduleCreate', component: ScheduleCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
