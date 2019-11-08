import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APIcallsService } from '../apicalls.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  scheduleId;
}

interface Customer {
  customerName: string;
  customerId: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  scheduleId;
  schedule;
  scheduleForm;
  alertFrequencies = [{ id: 'once',  name: 'Once'}, { id: 'daily', name : 'Daily'}];
  startDate;
  endDate;
  customerCtrl;
  disableBtn;
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
              private apiService: APIcallsService) { }

  ngOnInit() {
    $(document).ready(() => {
      $.getScript('../../assets/js/datepicker.js');
    });
    this.activatedRoute.params.subscribe((scheduleid) => {

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
      this.scheduleForm.disable();
      this.disableBtn = true;

      this.scheduleId = scheduleid.scheduleid;
      console.log(this.scheduleId);
      this.apiService.getSchedule(this.scheduleId).subscribe((schedule) => {
        this.schedule = schedule;
        // get customers
        this.apiService.getCustomers().subscribe((customers: any) => {
          this.customers = customers;
          this.customers.push({customerName: 'NONE', customerId: null});
          this.searchedCustomers = customers;
          if (this.schedule.customerId != null) {
            try {
              const customer = this.searchedCustomers.filter((filCustomer: Customer) =>
              filCustomer.customerId === this.schedule.customerId)[0];
              this.scheduleForm.controls.filterCustomer.setValue(customer);
            } catch (e) {
              Swal.fire('Warning', 'Customer with Id: ' + this.schedule.customerId, 'error');
            }
          }
        });

        const date = new Date(this.schedule.alertTime);
        this.scheduleForm.controls.scheduleName.setValue(this.schedule.subject);
        this.scheduleForm.controls.email.setValue(this.schedule.email);
        this.scheduleForm.controls.fileFormat.setValue('Excell Sheet');
        this.scheduleForm.controls.alertStartDate.setValue(date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() );
        this.scheduleForm.controls.alertStartTime.setValue(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
        if (this.schedule.trackerType === null) {
          this.schedule.trackerType = 'All';
        }
        if (this.schedule.status === null) {
          this.schedule.status = 'All';
        }
        this.scheduleForm.controls.alertFrequency.setValue(this.schedule.alertFrequency);
        this.scheduleForm.controls.filterStatus.setValue(this.schedule.status);
        this.scheduleForm.controls.filterModel.setValue(this.schedule.trackerType);

        if (this.schedule.startDate === null || this.schedule.endDate === null) {
          this.schedule.startDate = 'none';
          this.schedule.endDate = 'none';
        }
        const startDate = new Date(this.schedule.startDate);
        const endDate = new Date(this.schedule.endDate);
        this.scheduleForm.controls.filterStartDate.setValue(startDate.getMonth() +
        1 + '/' + startDate.getDate() + '/' + date.getFullYear());
        this.scheduleForm.controls.filterEndDate.setValue(endDate.getMonth() + 1 + '/' + endDate.getDate() + '/' + endDate.getFullYear());

        // this.scheduleForm.disable();
    });
    });
  }

  editForm() {
    this.scheduleForm.enable();
    this.disableBtn = false;
  }

  onSubmit(schedule, alertDate, filterStartDate, filterEndDate, alertTime) {
    if (schedule.filterStartDate === '' || schedule.filterEndDate === '') {
      schedule.filterEndDate = null;
      schedule.filterStartDate = null;
    }

    if (schedule.filterStatus === 'All') {
      schedule.filterStatus = null;
    }

    if (schedule.filterModel === 'All') {
      schedule.filterModel = null;
    }
    if (schedule.filterCustomer === undefined) {
      schedule.filterCustomer = null;
    }

    if (filterStartDate !== '' && filterEndDate !== '') {
      filterStartDate = new Date(filterStartDate);
      filterEndDate = new Date(filterEndDate);
      filterStartDate = this.dateFormat(filterStartDate);
      filterEndDate = this.dateFormat(filterEndDate);
    } else {
      filterStartDate = null;
      filterEndDate = null;
    }
    const fullAlertTime = new Date(alertDate + ' ' + alertTime);

    if (fullAlertTime > new Date()) {
      const zonId = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const newSchedule: Schedule = {
        email: schedule.email,
        subject: schedule.scheduleName,
        customerId: this.selectedCustomer,
        startDate: filterStartDate,
        endDate: filterEndDate,
        status: schedule.filterStatus,
        trackerType: schedule.filterModel,
        alertTime: fullAlertTime.toISOString(),
        alertFrequency: schedule.alertFrequency,
        zoneId: zonId,
        scheduleId: this.scheduleId
      };
      console.log(newSchedule);
      this.apiService.updateSchedule(newSchedule, this.scheduleId).subscribe((response) => {
        if (response === null) {
          Swal.fire('Great', 'Schedule Updated!', 'success');
        }
      });
    } else {
      Swal.fire('Sorry could not update schedule !',
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
