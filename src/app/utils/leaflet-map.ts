import {MAP_TILES} from "../../environments/environment";
import { Map, latLng, tileLayer, Layer, marker, icon } from 'leaflet';


export function createMap(id:string, config:object={minZoom: 6, maxZoom: 16}) {
    let map = new Map(id, config);

    tileLayer(MAP_TILES, {
        attribution: 'Utilizando mapas de redcuba.cu © Daxslab',
    }).addTo(map);

    return map;
}
