import { AfterContentInit, Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector, BingMaps, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/vector';
import KML from 'ol/format/KML';
import Overlay from 'ol/overlay';
import Feature from 'ol/Feature';
import { Fill, Stroke, Style } from 'ol/style';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { RES } from '../../models/res.model';
import { PowerLine } from '../..//models/power-line.model';
import {MapsService} from '../../services/maps.service';
import * as CanvasJS from '../../../assets/canvasjs/canvasjs.min.js';
import {normalizeStyles} from '@angular/animations/browser/src/util';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterContentInit {
  loaded: boolean;
  chart: any;

  constructor(public readonly maps: MapsService) {
    this.loaded = false;
    this.chart = null;
  }

  ngOnInit(): void {
    /**
     * Elements that make up the popup.
     */
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    this.maps.getSelectedRes()
      .subscribe((res: RES | null) => {
        if (res) {
          this.chart = new CanvasJS.Chart('chart', {
            width: 350,
            height: 350,
            animationEnabled: true,
            title: {
              text: res.title,
              fontFamily: 'Segoe UI',
              fontWeight: 'normal',
            },
            legend: {
              cursor: 'pointer',
              fontFamily: 'Segoe UI Light',
              itemclick: (e) => {
                if (typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === 'undefined' || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
                  e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
                } else {
                  e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
                }
                e.chart.render();

              }
            },
            data: [{
              type: 'pie',
              // startAngle: 50,
              showInLegend: true,
              toolTipContent: '{y}',
              dataPoints: [
                {y: res.planGa, legendText: 'План работ, га', color: '#4FC3F7'},
                {y: res.factGa, legendText: 'Факт. работ, га', color: '#81C784'},
              ]
            }]
          });
          this.chart.render();
        } else {
         // this.chart.destroy();
        }
      });

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


    console.log('MAP INIT');
    this.maps.map = new Map({
      target: document.getElementById('map'),
      layers: this.maps.layers,
      overlays: [overlay],
      view: this.maps.view
    });




    const displayFeatureInfo = (evt) => {
      const features = [];
      this.maps.map.forEachFeatureAtPixel(evt.pixel, function(feature) {
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
        console.log(this.maps.map.getTarget());
        this.maps.map.getTarget().style.cursor = 'pointer';

        const coordinate = evt.coordinate;

        const chartContainer = document.createElement('div');
        chartContainer.setAttribute('id', 'chart');
        content.appendChild(chartContainer);
        // content.innerHTML = info.join('');
        overlay.setPosition(coordinate);


        console.log('chart', chartContainer);
        const chart = new CanvasJS.Chart('chart', {
          animationEnabled: true,
          title: {
            text: ''
          },
          data: [{
            type: 'pie',
            startAngle: 240,
            yValueFormatString: '##0.00"%"',
            // indexLabel: "{label} {y}",
            dataPoints: [
              {y: 79.45, label: 'Google'},
              {y: 7.31, label: 'Bing'},
              {y: 7.06, label: 'Baidu'},
              {y: 4.91, label: 'Yahoo'},
              {y: 1.26, label: 'Others'}
            ]
          }]
        });
        chart.render();
      } else {
        this.maps.map.getTarget().style.cursor = '';
      }
    };


    this.maps.map.on('click', (evt) => {
      displayFeatureInfo(evt);
      // console.log(this.resVectorSource.getFeatures());
    });


    /*
    this.maps.map.once('postrender', function(event) {
      console.log('postrender MAP FINALLY LOADED');
    });
    */


    /*
    this.map.on('pointermove', (evt) => {

      if (evt.dragging) {
        return;
      }
      const pixel = this.map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(evt);
    });
    */
  }

  ngAfterContentInit(): void {
  this.maps.view.fit(this.maps.resSource.getExtent());

    /*
    setTimeout(() =>  {
      this.maps.resSource.getFeatures().forEach((feature: Feature) => {
        console.log('FEATURE ID', feature.get('id'));
        const findResById = (item: RES) => item.id === feature.get('id');
        this.maps.getRes().subscribe((items: RES[]) => {
          const resFound = items.find(findResById);
          if (resFound) {
            resFound.feature = feature;
          }
        });
      });
      // this.maps.view.fit(this.maps.resSource.getExtent());
    }, 5000);
    */
  }

  onResMouseEnter(res: RES) {
    // console.log(res.feature.getGeometry());
    // const style = new Style();
    // res.feature.getStyle().setFill(new Fill({color: '#00000'}));
    const style = new Style({
      stroke: new Stroke({
        color: '#333',
        width: 1
      })
    });
    res.feature.setStyle(style);
  }

  onResMouseOut(res: RES) {
    // this.res.forEach((res: RES) => {
    const style = new Style({
      stroke: new Stroke({
        color: 'ff0000ff',
        width: 1
      })
    });
    res.feature.setStyle(style);
    // });
  }

  selectPowerLine(line: PowerLine) {
    console.log(line);
    this.maps.selectPowerLine(line);
    this.maps.view.fit(line.source.getExtent());
  }

}
