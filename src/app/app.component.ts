

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Nsoroma';
  customers: Array<any>;
  constructor(private router: Router) {
   }

   ngOnInit() {  }

  customerNavigate(customerName, externalCustomerCode) {
    this.router.navigate(['customer', customerName, externalCustomerCode]);
  }

  unitsNavigate() {
    this.router.navigate(['units']);
  }

  schedulesNavigate() {
    this.router.navigate(['schedules']);
  }
  
}
