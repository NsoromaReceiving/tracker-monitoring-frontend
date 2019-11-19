
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


  /*trackersStateUrl = 'api/trackers/';
  trackerStateUrl = 'api/tracker/';
  schedulesUrl = 'api/schedules';
  scheduleUrl = 'api/schedule/';
  customersUrl = 'api/customers';*/

  trackersStateUrl = 'http://nsoromatrackers.hawkmanlabs.com/api/trackers/';
  trackerStateUrl = 'http://nsoromatrackers.hawkmanlabs.com/api/tracker/';
  schedulesUrl = 'http://nsoromatrackers.hawkmanlabs.com/api/schedules';
  scheduleUrl = 'http://nsoromatrackers.hawkmanlabs.com/api/schedule/';
  customersUrl = 'http://nsoromatrackers.hawkmanlabs.com/api/customers';


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
