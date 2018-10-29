import { AfterContentInit, Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector, BingMaps, XYZ } from 'ol/source';
import bbox from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/vector';
import KML from 'ol/format/KML';
import Overlay from 'ol/overlay';
import Feature from 'ol/Feature';
import { Fill, Stroke, Style } from 'ol/style';
import color from 'ol/color';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { RES } from './models/res.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterContentInit {
  title = 'app';
  latitude = 18.5204;
  longitude = 73.8567;
  res: RES[];
  map: any;
  view: View;
  resVectorSource: Vector;
  resVectorLayer: VectorLayer;
  tileLayer: TileLayer;
  featuresSubject: BehaviorSubject<any[]>;

  constructor() {
    this.featuresSubject = new BehaviorSubject<any[]>([]);
    this.res = [];
  }

  ngOnInit(): void {
    /**
     * Elements that make up the popup.
     */
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

      const format = new KML({
        extractStyles: true,
        defaultStyles: false,
        showPointNames: false
      });

      /*
      this.resVectorSource = new Vector({
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
          };
          xhr.onerror = onError;
          xhr.onload = () => {
            if (xhr.status === 200) {
              console.log(this.vectorSource.getFormat().readRegion());
              console.log(this.vectorSource.getFormat());
              this.vectorSource.addFeatures(
                format.readFeatures(xhr.responseText));
            } else {
              onError();
            }
          };
          xhr.send();
        },
        strategy: bbox
      });
      */

      this.resVectorLayer = new VectorLayer({
        source: this.resVectorSource = new Vector({
          url: 'http://localhost:4200/assets/kar_res.kml',
          format: format,
          useSpatialIndex: true
        }),
        zIndex: 5
      });

      // this.vectorSource = this.vectorLayer.getSource();

      this.view = new View({
        center: [4664211, 8741020],
        projection: 'EPSG:3857',
        zoom: 7
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
          this.resVectorLayer
        ],
        overlays: [overlay],
        view: this.view
      });


      const displayFeatureInfo = (evt) => {
        const features = [];
        this.map.forEachFeatureAtPixel(evt.pixel, function(feature) {
          console.log(feature);
          console.log(feature.getGeometryName());
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

      this.map.on('click', (evt) => {
        displayFeatureInfo(evt);
        console.log(this.resVectorSource.getFeatures());
      });

      /*
      this.map.once('postrender', function(event) {
        console.log('postrender', this.vectorSource.getFeatures());
      });
      */

      this.map.on('pointermove', (evt) => {
        if (evt.dragging) {
          return;
        }
        const pixel = this.map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(evt);
      });
  }

  ngAfterContentInit(): void {
    setTimeout(() =>  {
      this.resVectorSource.getFeatures().forEach((feature: Feature) => {
        const res = new RES(feature.get('id'), feature.get('name'), feature);
        this.res.push(res);
      });
      console.log('timeout', this.res);
      this.view.fit(this.resVectorSource.getExtent());
    }, 1000);
  }

  onResMouseEnter(res: RES) {
    //console.log(res.feature.getGeometry());
    // const style = new Style();
    //res.feature.getStyle().setFill(new Fill({color: '#00000'}));
    const style = new Style({
      stroke: new Stroke({
        color: '#333',
        width: 1
      })
    });
    res.feature.setStyle(style);
  }

  onResMouseOut(res: RES) {
    //this.res.forEach((res: RES) => {
      const style = new Style({
        stroke: new Stroke({
          color: 'ff0000ff',
          width: 1
        })
      });
      res.feature.setStyle(style);
    //});
  }

  onResSelect(res: RES) {
    console.log(res.isOpened);
    if (!res.isOpened) {
      this.view.fit(res.feature.getGeometry().getExtent());
      this.view.setZoom(9);
      res.isOpened = !res.isOpened;
    }
    res.isOpened = res.isOpened ? false : true;
  }
}


