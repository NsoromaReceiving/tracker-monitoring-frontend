


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class APIcallsService {

  // beating CORS
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*',
      Accept: 'application/json'
     })
  };

  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  params = new HttpParams();


  trackersStateUrl = 'http://127.0.0.1/api/trackers/';
  trackerStateUrl = 'http://127.0.0.1/api/tracker/';
  schedulesUrl = 'http://127.0.0.1/api/schedules';
  scheduleUrl = 'http://127.0.0.1/api/schedule/';
  customersUrl = 'http://127.0.0.1/api/customers';


  constructor(private http: HttpClient) {
    this.headers = this.headers.set('Access-Control-Allow-Origin', '*');
  }

  // get list of trackers
  getTrackers(startDate, endDate, customerId, type, status) {
    let queryParameters = '';
    if (startDate && endDate) {
      queryParameters += '?startDate=' + startDate + '&endDate=' + endDate;
    }
    if (customerId) {
      queryParameters += '&customerId=' + customerId;
    }
    if (type != null) {
      queryParameters += '&type=' + type;
    }
    if (status != null) {
      queryParameters += '&status=' + status;
    }
    return this.http.get(this.trackersStateUrl + queryParameters);
  }

  // get details of one tracker
  getTracker(trackerId) {
    return this.http.get(this.trackerStateUrl + trackerId);
  }

  getSchedules() {
    return this.http.get(this.schedulesUrl);
  }

  getSchedule(scheduleId) {
    return this.http.get(this.scheduleUrl + scheduleId);
  }

  createSchedule(schedule) {
    return this.http.post(this.schedulesUrl, schedule);
  }

  updateSchedule(schedule, scheduleId) {
    return this.http.put(this.scheduleUrl + scheduleId, schedule);
  }

  deleteSchedule(scheduleId) {
    return this.http.delete(this.scheduleUrl + scheduleId);
  }

  getCustomers() {
    return this.http.get(this.customersUrl, this.httpOptions);
  }

}
