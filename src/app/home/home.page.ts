import { Component } from '@angular/core';
import { DataService, Message } from '../services/data.service';
import {Geolocation, Plugins} from "@capacitor/core";
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";
import {faMapMarker} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  faMapMarker = faMapMarker;

  constructor(
      private data: DataService,
      public alertController: AlertController,
      private router: Router,
  ) {}

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current', coordinates);
    return coordinates;
  }

  async reportCrowd() {

    const { Device } = Plugins;

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

    this.getCurrentPosition().then((coordinates) => {
      this.data.postReport(coordinates.coords.latitude, coordinates.coords.longitude, info.uuid, additional_data)
          .subscribe((response: any) => {
            console.log('akak');
            switch (response.status) {
              case 200:
                this.presentAlert('Reporte Creado', 'Su reporte fue enviado satisfactoriamente.');
                break;
              case 400:
                this.presentAlert('Error', 'Ocurrio un error en el envío de sus datos.');
                break;
              case 403:
                if (response.errorCode == 5){
                  this.presentAlert('Lo sentimos', 'Usted no puede reportar el mismo lugar dos veces.');
                }else{
                  this.presentAlert('Lo sentimos', 'Usted no tiene permitido realizar un reporte');
                }
            }
          }, error => {
            this.presentAlert('Ups!!!', 'Ocurrió un error en el envío de su reporte, por favor intente más tarde.');
            console.log(error);
          });
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
