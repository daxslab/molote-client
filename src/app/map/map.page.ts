import { Component, OnInit } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker, icon } from 'leaflet';
import { MAP_TILES } from "../../environments/environment";
import { DataService } from "../services/data.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  map: Map;

  constructor(private data: DataService,) { }

  ionViewDidEnter() { this.leafletMap(); }

  ngOnInit() {
  }

  private leafletMap() {
    // In setView add latLng and zoom

    this.map = new Map('mapId', {
      minZoom: 6,
      maxZoom: 16
    }).setView([22.14957, -80.44662], 7);
    tileLayer(MAP_TILES, {
      attribution: 'Utilizando mapas de redcuba.cu © Daxslab',
    }).addTo(this.map);

    let dot = icon({
      iconUrl: 'assets/redDot1.png',
      iconSize: [15, 15], // size of the icon
    });

    this.data.getTrusties()
        .subscribe((response: any) => {
          if (response.code == 200) {
            response.data.forEach(crowd => {
              let location = JSON.parse(crowd.location);
              let lat = location.geometry.coordinates[0];
              let lng = location.geometry.coordinates[1];
              console.log(lat);
              console.log(lng);
              marker([lat, lng], { icon: dot }).addTo(this.map);
            });
          }
          console.log(response.message);
        }, error => {
          console.log(error);
        })
  }

  // /** Remove map when we have multiple map object */
  // ionViewWillLeave() {
  //   this.map.remove();
  // }

}
