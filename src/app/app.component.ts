import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector, BingMaps, XYZ } from 'ol/source';
import bbox from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/vector';
import KML from 'ol/format/KML';
import Overlay from 'ol/overlay';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


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
  view: View;
  vectorSource: Vector;
  vectorLayer: VectorLayer;
  tileLayer: TileLayer;
  featuresSubject: BehaviorSubject<any[]>;

  constructor() {
    this.featuresSubject = new BehaviorSubject<any[]>([]);
  }

  ngOnInit(): void {
    /**
     * Elements that make up the popup.
     */
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    setTimeout(() => {
      const format = new KML({
        extractStyles: true,
        defaultStyles: false,
        showPointNames: false
      });

      this.vectorSource = new Vector({
        format: format,
        useSpatialIndex: true,
        loader: (extent, resolution, projection) => {
          console.log('loader');
          const url = 'http://localhost:4200/assets/kar_res.kml';
          const xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          const onError = function() {
            // this.vectorSource.removeLoadedExtent(extent);
            console.error('erorr occured');
          }
          xhr.onerror = onError;
          xhr.onload = () => {
            if (xhr.status === 200) {
              console.log(xhr.responseText)
              console.log(this.vectorSource.getFormat());
              this.vectorSource.addFeatures(
                format.readFeatures(xhr.responseText));
            } else {
              onError();
            }
          }
          xhr.send();
        },
        strategy: bbox
      });

      this.vectorLayer = new VectorLayer({
        source: this.vectorSource,
        zIndex: 5
      });

      //this.vectorSource = this.vectorLayer.getSource();

      const view = new View({
        center: [4664211, 8741020],
        projection: 'EPSG:3857',
        zoom: 5
      });
      // view.fit(vectorSource.getExtent());

      /**
       * Create an overlay to anchor the popup to the map.
       */
      const overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });

      /**
       * Add a click handler to hide the popup.
       * @return {boolean} Don't follow the href.
       */
      closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };

      this.map = new Map({
        target: document.getElementById('map'),
        layers: [
          this.tileLayer = new TileLayer({
            zIndex: 1,
            source: new XYZ({
              url: 'http://10.50.0.172/hot/{z}/{x}/{y}.png',
              useSpatialIndex: true
            })

          }),
          this.vectorLayer
        ],
        overlays: [overlay],
        view: view
      });


      const displayFeatureInfo = (evt) => {
        const features = [];
        this.map.forEachFeatureAtPixel(evt.pixel, function(feature) {
          console.log(feature);
          features.push(feature);
        });
        if (features.length > 0) {
          const info = [];
          let i, ii;
          for (i = 0, ii = features.length; i < ii; ++i) {
            info.push('<h6 class="font-weight-bold">' + features[i].get('name') + '</h6>');
            info.push(features[i].get('description'));
          }
          console.log(this.map.getTarget());
          this.map.getTarget().style.cursor = 'pointer';

          const coordinate = evt.coordinate;

          content.innerHTML = info.join('');
          overlay.setPosition(coordinate);
        } else {
          this.map.getTarget().style.cursor = '';
        }
      };

      this.map.on('click', function(evt) {
        displayFeatureInfo(evt);
        console.log(this.vectorSource.getFeatures());
        view.fit(this.vectorSource.getExtent());
      });

      /*
      this.map.once('postrender', function(event) {
        console.log('postrender', this.vectorSource.getFeatures());
      });
      */

      this.map.on('pointermove', (evt) => {
        /*
        if (evt.dragging) {
          return;
        }
        const pixel = this.map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(evt);
        */
      });
    }, 1);
  }
}


