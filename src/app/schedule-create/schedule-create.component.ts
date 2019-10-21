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
  alertFrequencies = [{ id: 'once',  name: 'Once'}, { id: 'daily', name : 'Daily'}];
  startDate;
  endDate;
  customerCtrl;
  customers: Array<Customer> = [];
  searchedCustomers: Array<Customer>;
  selectedCustomer = null;

  trackerTypes = ['All', 'bcefm_light', 'bce_fms500_light_vt', 'qlgv300_n', 'concoxgt06n_gt80', 'bce_fms500_light', 'bce_fms500_one',
   'qlgv300_n_vt', 'qlgv55', 'qlgv65', 'telfmb640', 'telfmb120', 'telfma120_fw0119_vt', 'navixymobile_xgps', 'concoxgt100', 'qlgv65_vt',
   'concox_at4', 'qlgv55_vt', 'concoxgt100_vt', 'telfma120_fw0119', 'bce_fms500_stcan_vt', 'qlgmt200_vt', 'concox_x1', 'telfmb630', 'box',
   'qlgv320', 'qlgv300', 'qlgv65_n', 'telfmb120_vt_b120', 'qlgv320_vt', 'qlgl500_vt', 'box2_vt', 'mobile_unknown_xgps', 'concox_at2',
   'qlgl500_qlgl505', 'box2', 'qlgv55lite', 'concox_wetrack2', 'iosnavixytracker_xgps', 'qlgv500', 'box_vt', 'bce_fms500_stcan',
   'concox_x3', 'telfmb001', 'jimi_jc100'];

   trackerStatus = ['All', 'active', 'offline', 'signal_lost', 'idle', 'just_registered'];

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private apiService: APIcallsService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    $(document).ready(() => {
      this.apiService.getSchedules().subscribe((schedules: any) => {
        $.getScript('../../assets/js/datepicker.js');
      });
    });
    this.activatedRoute.params.subscribe((scheduleid) => {

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
        filterModel: new FormControl(),
        filterCustomer: new FormControl()
      });

      const date = new Date();
      this.scheduleForm.controls.fileFormat.setValue('Excell Sheet');
      this.scheduleForm.controls.alertFrequency.setValue('once');
      this.scheduleForm.controls.filterStatus.setValue('All');
      this.scheduleForm.controls.filterModel.setValue('All');
      this.scheduleForm.controls.alertStartTime.setValue(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
      this.scheduleForm.controls.filterCustomer.setValue();
      this.scheduleForm.controls.filterStartDate.setValue('none');
      this.scheduleForm.controls.filterEndDate.setValue('none');
    });


    this.apiService.getCustomers().subscribe((customers: any) => {
      this.customers = customers;
      this.searchedCustomers = customers;
    });
  }

  onSubmit(schedule, alertDate, filterStartDate, filterEndDate, alertTime) {
    if (schedule.filterStartDate === 'none' || schedule.filterEndDate === 'none') {
      schedule.filterEndDate = null;
      schedule.filterStartDate = null;
    }

    if (schedule.filterStatus === 'All') {
      schedule.filterStatus = null;
    }

    if (schedule.filterModel === 'All') {
      schedule.filterModel = null;
    }

    const fullAlertTime = new Date(alertDate + ' ' + alertTime);
    if (fullAlertTime > new Date()) {
      const zonId = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log(zonId);
      const newSchedule: Schedule = {
        email: schedule.email,
        subject: schedule.scheduleName,
        customerId: this.selectedCustomer,
        startDate: schedule.filterStartDate,
        endDate: schedule.filterEndDate,
        status: schedule.filterStatus,
        trackerType: schedule.filterModel,
        alertTime: fullAlertTime.toISOString(),
        alertFrequency: schedule.alertFrequency,
        zoneId: zonId
      };

      console.log(newSchedule);
      this.apiService.createSchedule(newSchedule).subscribe((response) => {
        if (response === null) {
          Swal.fire('Great', 'Schedule Created!', 'success');
          this.scheduleForm.reset();
        }
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

}
