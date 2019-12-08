import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIcallsService } from '../apicalls.service';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.css']
})
export class MainAppComponent implements OnInit {

  title = 'Nsoroma';
  customers: Array<any>;
  constructor(private router: Router, private apiSevice: APIcallsService) {
   }

   ngOnInit() {  }


  unitsNavigate() {
    this.router.navigate(['tracker/units']);
  }

  schedulesNavigate() {
    this.router.navigate(['tracker/schedules']);
  }

  loginNavigate() {
    this.apiSevice.expireToken().subscribe(response => {
      this.router.navigate(['/login']);
    });
  }
}
