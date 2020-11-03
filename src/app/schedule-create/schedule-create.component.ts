import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APIcallsService } from '../apicalls.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatAutocompleteSelectedEvent } from '@angular/material';

declare var $: any;

interface Schedule {
  email;
  alertFrequency;
  startDate;
  endDate;
  trackerType;
  customerId;
  alertTime;
  zoneId;
  status;
  subject;
  timeFrame;
  endTimeFrame;
  startTimeFrame;
  scheduleType;
  server;
}

interface Customer {
  customerName: string;
  customerId: string;
}

@Component({
  selector: 'app-schedule-create',
  templateUrl: './schedule-create.component.html',
  styleUrls: ['./schedule-create.component.css']
})

export class ScheduleCreateComponent implements OnInit {

  scheduleId;
  schedule;
  scheduleForm;
  alertFrequencies = [{ id: 'once',  name: 'Once'}, { id: 'everyday', name : 'Everyday'}];
  startDate;
  endDate;
  customerCtrl;
  customers: Array<Customer> = [];
  searchedCustomers: Array<Customer>;
  selectedCustomer = null;

  servers = ['All', 'server_one', 'server_two'];

  trackerStatus = ['All', 'active', 'offline', 'signal_lost', 'idle', 'just_registered'];

  scheduleType = ["INHOUSE", "CLIENT"]

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private apiService: APIcallsService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    $(document).ready(() => {
      $.getScript('../../assets/js/datepicker.js');
    });


    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    this.startDate = `${startDate.getUTCMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;

    this.customerCtrl = new FormControl();

    this.scheduleForm = new FormGroup({
      scheduleName: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      fileFormat: new FormControl(),
      alertStartDate: new FormControl(),
      alertStartTime: new FormControl(),
      alertFrequency: new FormControl(),
      filterStartDate: new FormControl(),
      filterEndDate: new FormControl(),
      filterStatus: new FormControl(),
      filterServer: new FormControl(),
      filterCustomer: new FormControl(),
      timeFrameCtrl: new FormControl(),
      startTimeFrameCtrl: new FormControl(),
      endTimeFrameCtrl: new FormControl(),
      filterScheduleType: new FormControl(),
    });

    const date = new Date();
    this.scheduleForm.controls.fileFormat.setValue('Excell Sheet');
    this.scheduleForm.controls.alertFrequency.setValue('once');
    this.scheduleForm.controls.filterStatus.setValue('All');
    this.scheduleForm.controls.filterServer.setValue('All');
    this.scheduleForm.controls.alertStartTime.setValue(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
    this.scheduleForm.controls.filterCustomer.setValue();
    this.scheduleForm.controls.timeFrameCtrl.setValue(0);
    this.scheduleForm.controls.startTimeFrameCtrl.setValue(0);
    this.scheduleForm.controls.endTimeFrameCtrl.setValue(0);
    this.scheduleForm.controls.filterScheduleType.setValue("INHOUSE");


    this.apiService.getCustomers().subscribe((customers: any) => {
      this.customers = customers;
      this.searchedCustomers = customers;
    }, (error) => {
      this.router.navigate(['error']);
    });
  }

  onSubmit(schedule, alertDate, filterStartDate, filterEndDate, alertTime) {

    // filter start date
    if (filterStartDate !== '' && filterStartDate !== null) {
      filterStartDate = new Date(filterStartDate);

      if (filterStartDate !== filterStartDate instanceof Date && !isNaN(filterStartDate)) {
        filterStartDate = this.dateFormat(filterStartDate);
      } else {
        Swal.fire(
          'Invalid Start Date',
          'Please make sure to select a date from the date control or enter a valid date format',
          'error'
        );
        return;
      }
    } else {
      filterStartDate = null;
    }


    // filter end date
    if (filterEndDate !== '' && filterEndDate !== null) {
      filterEndDate = new Date(filterEndDate);

      if (filterEndDate !== filterEndDate instanceof Date && !isNaN(filterEndDate)) {
        filterEndDate = this.dateFormat(filterEndDate);
      } else {
        Swal.fire(
          'Invalid End Date',
          'Please make sure to select a date from the date control or enter a valid date format',
          'error'
        );
        return;
      }
    } else {
      filterEndDate = null;
    }


    console.log(filterStartDate);
    console.log(filterEndDate);


    if (schedule.filterStatus === 'All') {
      schedule.filterStatus = null;
    }

    if (schedule.filterServer === 'All') {
      schedule.filterServer = null;
    } else if(schedule.filterServer === 'server_one') {
      schedule.filterServer = '1';
    } else {
      schedule.filterServer = '2';
    }

    if (schedule.timeFrameCtrl < 1 || schedule.timeFrameCtrl === undefined) {
      schedule.timeFrameCtrl = null;
    }

    if (schedule.startTimeFrameCtrl < 1 || schedule.startTimeFrameCtrl === undefined) {
      schedule.startTimeFrameCtrl = null;
    }

    if (schedule.endTimeFrameCtrl < 1 || schedule.endTimeFrameCtrl === undefined) {
      schedule.endTimeFrameCtrl = null;
    }

    const fullAlertTime = new Date(alertDate + ' ' + alertTime);
    if (fullAlertTime > new Date()) {
      const zonId = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log(zonId);
      const newSchedule: Schedule = {
        email: schedule.email,
        subject: schedule.scheduleName,
        customerId: this.selectedCustomer,
        startDate: filterStartDate,
        endDate: filterEndDate,
        status: schedule.filterStatus,
        trackerType: null,
        alertTime: fullAlertTime.toISOString(),
        alertFrequency: schedule.alertFrequency,
        zoneId: zonId,
        timeFrame: schedule.timeFrameCtrl,
        startTimeFrame: schedule.startTimeFrameCtrl,
        endTimeFrame: schedule.endTimeFrameCtrl,
        scheduleType: schedule.filterScheduleType,
        server: schedule.filterServer
      };

      console.log(newSchedule);
      this.apiService.createSchedule(newSchedule).subscribe((response) => {
        if (response === null) {
          Swal.fire('Great', 'Schedule Created!', 'success');
          this.scheduleForm.reset();
        }
      }, (error) => {
        this.router.navigate(['error']);
      });
    } else {
      Swal.fire('Sorry could not create "' + schedule.scheduleName + '" schedule !',
      'Please make sure you select a future alert Date and Time.', 'error');
    }

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



  get scheduleName() {
    return this.scheduleForm.get('scheduleName');
  }

  get email() {
    return this.scheduleForm.get('email');
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
