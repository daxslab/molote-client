import {Geolocation} from "@capacitor/core";


export async function getCurrentPosition() {
  return await Geolocation.getCurrentPosition();
};
