import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { APIcallsService } from '../apicalls.service';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var $: any;

interface Customer {
  customerName: string;
  customerId: string;
}

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})

export class UnitsComponent implements OnInit {

  trackerUrl = 'http://134.209.26.203/api/trackers/';

  trackerStates: Array<any>;
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

  constructor(private apiService: APIcallsService, private router: Router) { }

  ngOnInit() {
    $(document).ready(() => {
      $.getScript('../../assets/js/datepicker.js');
    });

    /*// date element setting
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    this.startDate = `${startDate.getUTCMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;
    const endDate = new Date();
    endDate.setDate(endDate.getDate());
    this.endDate = `${endDate.getUTCMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`;
    */

    // setting date to null
    this.startDate = null;
    this.endDate = null;

    // auto complete search angular material element
    this.customerCtrl = new FormControl();


    // fething all trackers
    this.apiService.getTrackers(null, null, null, null, null).subscribe((trackerStates: any) => {
      this.trackerStates = trackerStates;
      $.getScript('../../assets/js/loadfootable.js');
      this.totalTrackers = this.trackerStates.length;
      this.activeTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'active').length;
      this.offlineTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'offline').length;
      this.signalLostTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'signal_lost').length;
      this.idleTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'idle').length;
      this.justRegisteredTrackers = this.trackerStates.filter((trackerState) =>
      trackerState.connectionStatus === 'just_registered').length;

      // get customers

    }, (error) => {
      this.router.navigate(['login']);
    });

    this.apiService.getCustomers().subscribe((customers: any) => {
      this.customers = customers;
      this.searchedCustomers = customers;
    }, (error) => {
      this.router.navigate(['login']);
    });

  }


  refresh() {
    location.reload();
  }


  getTrackers(startDate, endDate, type, status) {
    if (type === 'All') {
      type = null;
    }
    if (status === 'All') {
      status =  null;
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
    this.apiService.getTrackers(startDate, endDate, this.selectedCustomer, type, status).subscribe((trackerStates: any) => {
    this.trackerStates = trackerStates;

    this.totalTrackers = this.trackerStates.length;
    this.activeTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'active').length;
    this.offlineTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'offline').length;
    this.signalLostTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'signal_lost').length;
    this.idleTrackers = this.trackerStates.filter((trackerState) => trackerState.connectionStatus === 'idle').length;
    this.justRegisteredTrackers = this.trackerStates.filter((trackerState) =>
    trackerState.connectionStatus === 'just_registered').length;
    }, (error) => {
      this.router.navigate(['login']);
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
