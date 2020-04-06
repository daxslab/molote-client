import {Component} from '@angular/core';
import {DataService, Message} from '../services/data.service';
import {Geolocation, Plugins} from "@capacitor/core";
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";
import {faMapMarker} from "@fortawesome/free-solid-svg-icons";
import {getCurrentPosition} from "../utils/geolocation";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  faMapMarker = faMapMarker;
  loading = false;

  constructor(
    private data: DataService,
    public alertController: AlertController,
    private router: Router,
  ) {
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  // async getCurrentPosition() {
  //   const coordinates = await Geolocation.getCurrentPosition();
  //   return coordinates;
  // }

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

    getCurrentPosition().then((coordinates) => {

      this.loading = true;
      let reportSubscription = this.data.postReport(coordinates.coords.latitude, coordinates.coords.longitude, info.uuid, additional_data)
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

    }).catch(error => {
      this.presentAlert('Ups!!!', 'No se pudo obtener la geolocalización.');
    });
  }

  async presentAlert(title, message) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  showMap() {
    this.router.navigate(['map']);
  }

}
