import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SERVER_URL} from "../../environments/environment";
import {DevicePlugin} from "@capacitor/core";

export interface Message {
  fromName: string;
  subject: string;
  date: string;
  id: number;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  public postReport(lat, lng, uuid, additional_data){

      return this.httpClient.post(SERVER_URL + '/report/create', {
      "lat": lat,
      "lng": lng,
      "uuid": uuid,
      "additional_data": additional_data
    })
  }

  public getTrusties(){
    return this.httpClient.get(SERVER_URL + '/crowd/get-trusties')
  }

}
