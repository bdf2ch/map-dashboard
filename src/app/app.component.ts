import {Component, OnInit} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector, BingMaps, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/vector';
import KML from 'ol/format/KML';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  latitude = 18.5204;
  longitude = 73.8567;
  map: any;

  ngOnInit(): void {
    const source = new KML({
      extractStyles: true,
      defaultStyles: false,
      showPointNames: false
    });

    console.log('KML name: ', source.readName('Document'));

    const vector = new VectorLayer({
      source: new Vector({
        url: 'http://localhost:4200/assets/01.kml',
        format: source
      }),
      zIndex: 5
    });

    const view = new View({
      center: [4664211, 8741020],
      projection: 'EPSG:3857',
      zoom: 5
    });
    // view.fit(vector.extent);


    this.map = new Map({
      target: document.getElementById('map'),
      layers: [
        new TileLayer({
          zIndex: 1,
          source: new XYZ({
            url: 'http://10.50.0.172/hot/{z}/{x}/{y}.png'
          })

        }),
        vector
      ],
      view: view
    });



    const displayFeatureInfo = (pixel) => {
      const features = [];
      this.map.forEachFeatureAtPixel(pixel, function(feature) {
        console.log(feature);
        features.push(feature);
      });
      if (features.length > 0) {
        const info = [];
        let i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
          info.push(features[i].get('name'));
          info.push(features[i].get('description'));
        }
        document.getElementById('info').innerHTML = info.join(', ') || '(unknown)';
        console.log(this.map.getTarget());
        this.map.getTarget().style.cursor = 'pointer';
      } else {
        document.getElementById('info').innerHTML = '&nbsp;';
        this.map.getTarget().style.cursor = '';
      }
    };

    this.map.on('pointermove', (evt) => {
      if (evt.dragging) {
        return;
      }
      const pixel = this.map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel);
    });

    this.map.on('click', function(evt) {
      displayFeatureInfo(evt.pixel);
    });

  }
}
