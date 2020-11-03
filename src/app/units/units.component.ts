import { AfterViewInit, Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { APIcallsService } from '../apicalls.service';
import { MatAutocompleteSelectedEvent, MatSort } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ViewChild } from '@angular/core';

declare var $: any;

interface Customer {
  customerName: string;
  customerId: string;
}

export interface TrackerState {
  imei: string;
  customerName: string;
  label: string;
  lastGsmUpdate: string;
  connectionStatus: string;
  trackerId: string;
}

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})


export class UnitsComponent implements OnInit, AfterViewInit {

  trackerUrl = 'http://134.209.26.203/api/trackers/';

  trackerStates: Array<TrackerState> = [];
  customers: Array<Customer> = [];
  searchedCustomers: Array<Customer>;
  trackerTypes: Array<string>;
  totalTrackers;
  activeTrackers;
  offlineTrackers;
  signalLostTrackers;
  idleTrackers;
  justRegisteredTrackers;
  startDate;
  endDate;

  customerCtrl: FormControl;
  selectedCustomer = null;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: false}) sort: MatSort;


  constructor(private apiService: APIcallsService, private router: Router) { }

  displayedColumns: string[] = ['IMEI', 'COMPANY', 'REGISTRATION NO.', 'LAST GSM UPDATE', 'STATUS', 'ACTION'];

  dataSource = new MatTableDataSource<TrackerState>(this.trackerStates);


  ngAfterViewInit() {
    this.apiService.getTrackers(null, null, null, null, null, null).subscribe((trackerStates: any) => {
      this.trackerStates = trackerStates;
      this.trackerStates.sort(function(a,b){
        return new Date(b.lastGsmUpdate) - new Date(a.lastGsmUpdate);
      });
      this.dataSource = new MatTableDataSource<TrackerState>(this.trackerStates);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.totalTrackers = this.trackerStates.length;
      this.activeTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'active').length;
      this.offlineTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'offline').length;
      this.signalLostTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'signal_lost').length;
      this.idleTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'idle').length;
      this.justRegisteredTrackers = this.trackerStates.filter((trackerState) =>
      trackerState.connectionStatus === 'just_registered').length;

      // get customers

    }, (error) => {
      this.router.navigate(['error']);
    });

    this.apiService.getCustomers().subscribe((customers: any) => {
      this.customers = customers;
      this.searchedCustomers = customers;
    }, (error) => {
      this.router.navigate(['error']);
    });

  }
  ngOnInit() {
    $(document).ready(() => {
      $.getScript('../../assets/js/datepicker.js');
    });
    

    // setting date to null
    this.startDate = null;
    this.endDate = null;

    // auto complete search angular material element
    this.customerCtrl = new FormControl();


    // fething all trackers
  

  }


  refresh() {
    location.reload();
  }


  getTrackers(startDate, endDate, type, status, server) {
    if (type === 'All') {
      type = null;
    }
    if (status === 'All') {
      status =  null;
    }
    if  (server === 'All') {
      server = null;
    } else if(server == 'server_one') {
      server = 1;
    } else {
      server = 2
    }

    // start date validation
    if (startDate !== '' && startDate !== null) {
      startDate = new Date(startDate);

      if (startDate !== startDate instanceof Date && !isNaN(startDate)) {
        startDate = this.dateFormat(startDate);
      } else {
        Swal.fire(
          'Invalid Start Date',
          'Please make sure to select a date from the date control or enter a valid date format',
          'error'
        );
        return;
      }
    } else {
      startDate = null;
    }


    // end date validation
    if (endDate !== '' && endDate !== null) {
      endDate = new Date(Date.parse(endDate));

      if (endDate !== endDate instanceof Date && !isNaN(endDate)) {
        endDate = this.dateFormat(endDate);
      } else {
        Swal.fire(
          'Invalid End Date',
          'Please make sure to select a date from the date control or enter a valid date format',
          'error'
        );
        return;
      }
    } else {
      endDate = null;
    }

    console.log(startDate);
    console.log(endDate);
    console.log(type);
    console.log(status);
    console.log(this.selectedCustomer);
    this.apiService.getTrackers(startDate, endDate, this.selectedCustomer, type, status, server).subscribe((trackerStates: any) => {
    this.trackerStates = trackerStates;
    this.dataSource = new MatTableDataSource<TrackerState>(this.trackerStates);
    this.dataSource.paginator = this.paginator;


    this.totalTrackers = this.trackerStates.length;
    this.activeTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'active').length;
    this.offlineTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'offline').length;
    this.signalLostTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'signal_lost').length;
    this.idleTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'idle').length;
    this.justRegisteredTrackers = this.trackerStates.filter((trackerState) =>
    trackerState.connectionStatus === 'just_registered').length;
    }, (error) => {
      this.router.navigate(['error']);
    });
  }

  trackerStateNavigate(trackerId) {
    this.router.navigate(['tracker/unit', trackerId]);
  }

  customerTextChange(searchtxt) {
    if (searchtxt !== '') {
      const searchedCustomers = this.customers.filter((customer) =>
      customer.customerName.toLowerCase().startsWith(searchtxt.toLowerCase()));
      this.searchedCustomers = searchedCustomers;
    } else {
      this.searchedCustomers = this.customers;
      this.selectedCustomer = null;
    }
  }

  setCustomer(event: MatAutocompleteSelectedEvent) {
    const customer = event.option.value.customerId;
    console.log(customer);
    if (customer !== '') {
      this.selectedCustomer = customer;
    } else {
      this.selectedCustomer = null;
    }
  }

  customerDisplayFunction(customer?: any): string | undefined {
    return customer ? customer.customerName : undefined;
  }

  dateFormat(date): string {
    return date.getFullYear()
              + '-' + this.leftpad(date.getMonth() + 1, 2)
              + '-' + this.leftpad(date.getDate(), 2)
              + ' ' + this.leftpad(date.getHours(), 2)
              + ':' + this.leftpad(date.getMinutes(), 2)
              + ':' + this.leftpad(date.getSeconds(), 2);
  }

  leftpad(val, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
          + String(val)).slice(String(val).length);
  }

}
