
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

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


  trackersStateUrl = 'api/trackers/';
  trackerStateUrl = 'api/tracker/';
  schedulesUrl = 'api/schedules';
  scheduleUrl = 'api/schedule/';
  customersUrl = 'api/customers';
  loginUrl = 'security/login';
  tokenExpireUrl = 'security/expire?&token=';
  validateTokenUrl = 'security/validate/';


  constructor(private http: HttpClient, private cookies: CookieService) {
  }

  // get list of trackers
  getTrackers(startDate, endDate, customerId, type, status, server) {
    let queryParameters = '?';
    if (startDate) {
      queryParameters += '&startDate=' + startDate;
    }
    if (endDate) {
      queryParameters += '&endDate=' + endDate;
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
    if (server != null) {
      queryParameters += '&server=' + server;
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
    console.log(schedule)
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

  login(user) {
    return this.http.post(this.loginUrl, user);
  }

  expireToken() {
    return this.http.get(this.tokenExpireUrl + this.cookies.get('token'));
  }

  validateToken() {
    return this.http.get(this.validateTokenUrl);
  }

}
