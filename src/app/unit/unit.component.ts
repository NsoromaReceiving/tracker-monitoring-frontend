import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIcallsService } from '../apicalls.service';
import { AgmMap } from '@agm/core';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  trackerId;
  imei = '';
  connectionStatus;
  lastGpsUpdate = '';
  label = '';
  customerName = '';
  customerid = '';
  phoneNumber = '';
  trackerModel = '';
  latitude;
  longitude;
  lastGpsSignalLevel = '';
  lastBatteryLevel = '';
  lastGsmLevel = '';
  networkName = '';
  tariffEndDate = '';
  timeStamp;

  agmMap: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private apiService: APIcallsService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe( tripId => {
      this.trackerId = tripId.trackerid;
      this.apiService.getTracker(this.trackerId).subscribe((trackerState: any) => {
        this.imei = trackerState.imei;
        this.connectionStatus = trackerState.connectionStatus;
        this.lastGpsUpdate = trackerState.lastGpsUpdate;
        this.label = trackerState.label;
        this.customerName = trackerState.customerName;
        this.customerid = trackerState.customerId;
        this.phoneNumber = trackerState.phoneNumber;
        this.trackerModel = trackerState.model;
        this.latitude = trackerState.lastGpsLatitude;
        this.longitude = trackerState.lastGpsLongitude;
        this.lastGpsSignalLevel = trackerState.lastGpsSignalLevel;
        this.lastBatteryLevel = trackerState.lastBatteryLevel;
        this.lastGsmLevel = trackerState.gsmSignalLevel;
        this.networkName = trackerState.gsmNetworkName;
        this.tariffEndDate = trackerState.tariffEndDate;
        const date = new Date();
        this.timeStamp = date.toUTCString();
        this.agmMap.panTo({lat: Number(this.latitude), lng: Number(this.longitude)});
      });
    });
  }

  getMapInstance(map) {
    this.agmMap = map;
  }

}
