import { Component, OnInit } from '@angular/core';
import { APIcallsService } from '../apicalls.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {
  schedules: Array<any>;
  constructor(private apiService: APIcallsService, private router: Router) { }

  ngOnInit() {
    $(document).ready(() => {
      this.apiService.getSchedules().subscribe((schedules: any) => {
        this.schedules = schedules;
        $.getScript('../../assets/js/loadfootable.js');
      },
      (error) => {
        this.router.navigate(['login']);
      });
    });
  }

  scheduleNavigate(scheduleId) {
    this.router.navigate(['tracker/schedule', scheduleId]);
  }

  scheduleCreateNavigate() {
    this.router.navigate(['tracker/scheduleCreate']);
  }

  confirmDelete(scheduleId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this schedule!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it.'
    }).then((result) => {
      if (result.value) {
        this.deleteSchedule(scheduleId);
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Schedule is Save :)',
          'error'
        );
      }
    });
  }

  deleteSchedule(scheduleId) {
    this.apiService.deleteSchedule(scheduleId).subscribe((data: any) => {
      if (data === null) {
        this.apiService.getSchedules().subscribe((schedules: any) => {
          Swal.fire(
            'Deleted!',
            'Schedule deleted successfully',
            'success'
          );
          this.schedules = schedules;
        });
      }
    });
  }

  refresh() {
    location.reload();
  }

}
