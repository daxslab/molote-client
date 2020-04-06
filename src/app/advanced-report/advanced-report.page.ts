import {Component, OnInit} from '@angular/core';
import {Map, circle, Marker} from 'leaflet';
import {DataService} from "../services/data.service";
import {getCurrentPosition} from "../utils/geolocation";
import {createMap} from "../utils/leaflet-map";
import {GeolocationPosition, Plugins} from "@capacitor/core";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-advanced-report',
  templateUrl: './advanced-report.page.html',
  styleUrls: ['./advanced-report.page.scss'],
})
export class AdvancedReportPage implements OnInit {

  map: Map;
  coordinates: GeolocationPosition;
  locationCircle: circle;
  marker: Marker;
  loading = false;

  constructor(
    private data: DataService,
    private alertController: AlertController
    ) {
  }

  ionViewDidEnter() {
    this.leafletMap();
  }

  ngOnInit() {
  }

  private leafletMap() {
    getCurrentPosition()
      .then((coordinates) => {
        this.coordinates = coordinates;

        this.map = createMap('mapId')
          .setView([coordinates.coords.latitude, coordinates.coords.longitude], 16);

        this.locationCircle = circle([coordinates.coords.latitude, coordinates.coords.longitude], 150);
        this.locationCircle.addTo(this.map);

        let _this = this;
        this.map.on("click", function(e){
          _this.setMarker(e);
        });
      })
  }

  private setMarker(e){
    if (this.isInLocationCircle(e)){
      if (this.marker){
        this.marker.remove();
      }
      this.marker = new Marker([e.latlng.lat, e.latlng.lng]);
      this.marker.addTo(this.map);
    }
  }

  private isInLocationCircle(element){
    let d = this.map.distance(element.latlng, this.locationCircle.getLatLng());
    return  d < this.locationCircle.getRadius();
  }

  async reportCrowd() {

    const {Device} = Plugins;

    let info = await Device.getInfo();

    // get some info for debugging
    let additional_data = JSON.stringify({
      app_version: info.appVersion,
      app_build: info.appBuild,
      platform: info.platform,
      model: info.model,
      os: info.operatingSystem,
      os_version: info.osVersion,
      manufacturer: info.manufacturer
    });

    let as = this.marker;

    this.loading = true;
    let reportSubscription = this.data.postReport(this.marker.getLatLng().lat, this.marker.getLatLng().lng, info.uuid, additional_data)
      .subscribe(
        (okResponse: any) => {
          this.presentAlert('Reporte Creado', okResponse.data.message);
        },
        (errorResponse: any) => {
          let message = errorResponse.error.data ? errorResponse.error.data.message : 'Ha ocurrido un error';
          this.presentAlert('Error', message);
        }
      );

    reportSubscription.add(() => {
      this.loading = false;
    })

  }

  async presentAlert(title, message) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
