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
  timeFrame;
  endTimeFrame;
  startTimeFrame;
  scheduleType;
  server;
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
  alertFrequencies = [{ id: 'once',  name: 'Once'}, { id: 'everyday', name : 'Everyday'}];
  startDate;
  endDate;
  customerCtrl;
  disableBtn;
  customers: Array<Customer> = [];
  searchedCustomers: Array<Customer>;
  selectedCustomer = null;

   servers = ['All', 'server_one', 'server_two'];

   trackerStatus = ['All', 'active', 'offline', 'signal_lost', 'idle', 'just_registered'];

   scheduleType = ["INHOUSE", "CLIENT"]

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
        filterServer: new FormControl(),
        filterCustomer: new FormControl(),
        timeFrameCtrl: new FormControl(),
      startTimeFrameCtrl: new FormControl(),
      endTimeFrameCtrl: new FormControl(),
      filterScheduleType: new FormControl()
      });
      this.scheduleForm.disable();
      this.disableBtn = true;

      this.scheduleId = scheduleid.scheduleid;
      console.log(this.scheduleId);
      this.apiService.getSchedule(this.scheduleId).subscribe((schedule) => {
        this.schedule = schedule;
        console.log(schedule);
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

        if(this.schedule.server === '1') {
          this.schedule.server = 'server_one';
        } else if(this.schedule.server = '2') {
          this.schedule.server = 'server_two';
        } else {
          this.schedule.server = 'All';
        }

        this.scheduleForm.controls.alertFrequency.setValue(this.schedule.alertFrequency);
        this.scheduleForm.controls.filterStatus.setValue(this.schedule.status);
        this.scheduleForm.controls.timeFrameCtrl.setValue(Number(this.schedule.timeFrame));
        this.scheduleForm.controls.startTimeFrameCtrl.setValue(Number(this.schedule.startTimeFrame));
        this.scheduleForm.controls.endTimeFrameCtrl.setValue(Number(this.schedule.endTimeFrame));
        this.scheduleForm.controls.filterScheduleType.setValue(this.schedule.scheduleType)
        this.scheduleForm.controls.filterServer.setValue(this.schedule.server)

        if (this.schedule.startDate !== null) {
          const startDate = new Date(this.schedule.startDate);
          this.scheduleForm.controls.filterStartDate.setValue(startDate.getMonth() +
            1 + '/' + startDate.getDate() + '/' + date.getFullYear());
        } else {
          this.startDate = '';
        }

        if ( this.schedule.endDate !== null) {
          const endDate = new Date(this.schedule.endDate);
          this.scheduleForm.controls.filterEndDate.setValue(endDate.getMonth() + 1 +
            '/' + endDate.getDate() + '/' + endDate.getFullYear());
        } else {
          this.endDate = '';
        }
    }, (error) => {
      this.router.navigate(['error']);
    });
    });
  }

  editForm() {
    this.scheduleForm.enable();
    this.disableBtn = false;
  }

  onSubmit(schedule, alertDate, filterStartDate, filterEndDate, alertTime) {

    if (schedule.filterStatus === 'All') {
      schedule.filterStatus = null;
    }

    if (schedule.filterModel === 'All') {
      schedule.filterModel = null;
    }
    if (schedule.filterCustomer === undefined) {
      schedule.filterCustomer = null;
    }


    // start date
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

    // end date
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

    if (schedule.timeFrameCtrl < 1 || schedule.timeFrameCtrl === undefined) {
      schedule.timeFrameCtrl = null;
    }

    if (schedule.startTimeFrameCtrl < 1 || schedule.startTimeFrameCtrl === undefined) {
      schedule.startTimeFrameCtrl = null;
    }

    if (schedule.endTimeFrameCtrl < 1 || schedule.endTimeFrameCtrl === undefined) {
      schedule.endTimeFrameCtrl = null;
    }

    if (schedule.filterServer === 'All') {
      schedule.filterServer = null;
    } else if(schedule.filterServer === 'server_one') {
      schedule.filterServer = '1';
    } else {
      schedule.filterServer = '2';
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
        trackerType: null,
        alertTime: fullAlertTime.toISOString(),
        alertFrequency: schedule.alertFrequency,
        zoneId: zonId,
        scheduleId: this.scheduleId,
        timeFrame: schedule.timeFrameCtrl,
        endTimeFrame: schedule.endTimeFrameCtrl,
        startTimeFrame: schedule.startTimeFrameCtrl,
        scheduleType: schedule.filterScheduleType,
        server: schedule.filterServer
      };
      console.log(newSchedule);
      this.apiService.updateSchedule(newSchedule, this.scheduleId).subscribe((response) => {
        if (response === null) {
          Swal.fire('Great', 'Schedule Updated!', 'success');
        }
      }, (error) => {
        this.router.navigate(['error']);
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
