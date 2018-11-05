import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {finalize, map} from 'rxjs/operators';
import { RES } from '../models/res.model';
import { IRes } from '../interfaces/res.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import KML from 'ol/format/KML';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import { Vector, XYZ } from 'ol/source';
import View from 'ol/view';
import Map from 'ol/map';
import { PowerLine } from '../models/power-line.model';
import 'rxjs/observable/fromPromise';
import { MapsResource } from '../resources/maps.resource';
import 'rxjs/add/observable/fromPromise';
import { fromPromise } from 'rxjs/observable/fromPromise';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import CircleStyle from 'ol/style/Circle';
import Feature from 'ol/feature';
import Circle from 'ol/geom/Circle';

@Injectable()
export class MapsService {
  public map: Map;
  public readonly view: View;
  private readonly format: KML;
  private readonly resFormat: GeoJSON;
  public  resLayer: VectorLayer;
  public resSource: Vector;
  public readonly tileLayer: TileLayer;
  private readonly tileSource: XYZ;
  public layers: any[];
  private res: BehaviorSubject<RES[]>;
  private selectedPowerLine: BehaviorSubject<PowerLine>;
  private readonly urls = [
    'assets/КАР000004_КАР000000167.kml',
    'assets/КАР000004_КАР000000172.kml',
    'assets/КАР000004_КАР000000184.kml',
    'assets/КАР000004_КАР000000185.kml',
    'assets/КАР000004_КАР000000186.kml',
    'assets/КАР000004_КАР000000187.kml',
    'assets/КАР000004_КАР000000192.kml',
    'assets/КАР000004_КАР000000193.kml',
    'assets/КАР000004_КАР000000194.kml',
    'assets/КАР000004_КАР000000195.kml',
    'assets/КАР000004_КАР000000196.kml',
    'assets/КАР000004_КАР000000212.kml',
    'assets/КАР000008_КАР000000138.kml',
    'assets/КАР000008_КАР000000140.kml',
    'assets/КАР000008_КАР000000141.kml',
    'assets/КАР000008_КАР000000142.kml',
    'assets/КАР000008_КАР000000144.kml',
    'assets/КАР000008_КАР000000145.kml',
    'assets/КАР000008_КАР000000146.kml',
    'assets/КАР000008_КАР000000147.kml',
    'assets/КАР000008_КАР000000149.kml',
    'assets/КАР000008_КАР000000150.kml',
    'assets/КАР000008_КАР000000151.kml',
    'assets/КАР000008_КАР000000152.kml',
    'assets/КАР000008_КАР000000153.kml',
    'assets/КАР000008_КАР000000154.kml',
    'assets/КАР000008_КАР000000155.kml',
    'assets/КАР000008_КАР000000156.kml',
    'assets/КАР000008_КАР000000157.kml',
    'assets/КАР000008_КАР000000199.kml',
    'assets/КАР000008_КАР000000200.kml',
    'assets/КАР000013_КАР000000168.kml',
    'assets/КАР000013_КАР000000169.kml',
    'assets/КАР000013_КАР000000170.kml',
    'assets/КАР000013_КАР000000171.kml',
    'assets/КАР000013_КАР000000174.kml',
    'assets/КАР000013_КАР000000176.kml',
    'assets/КАР000013_КАР000000177.kml',
    'assets/КАР000013_КАР000000178.kml',
    'assets/КАР000013_КАР000000179.kml',
    'assets/КАР000013_КАР000000181.kml',
    'assets/КАР000013_КАР000000183.kml',
    'assets/КАР000013_КАР000000259.kml',
    'assets/КАР000013_КАР000000261.kml',
    'assets/КАР000013_КАР000000262.kml',
    'assets/КАР000013_КАР000000264.kml',
    'assets/КАР000016_КАР000000158.kml',
    'assets/КАР000016_КАР000000162.kml',
    'assets/КАР000016_КАР000000163.kml',
    'assets/КАР000016_КАР000000164.kml',
    'assets/КАР000016_КАР000000165.kml',
    'assets/КАР000016_КАР000000166.kml',
    'assets/КАР000035_КАР000000101.kml',
    'assets/КАР000035_КАР000000104.kml',
    'assets/КАР000035_КАР000000111.kml',
    'assets/КАР000035_КАР000000276.kml',
    'assets/КАР000035_КАР000000277.kml',
    'assets/КАР000035_КАР000000278.kml',
    'assets/КАР000035_КАР000000279.kml',
    'assets/КАР000035_КАР000000280.kml',
    'assets/КАР000035_КАР000000281.kml',
    'assets/КАР000035_КАР000000283.kml',
    'assets/КАР000035_КАР000000284.kml',
    'assets/КАР000035_КАР000000285.kml',
    'assets/КАР000035_КАР000000336.kml',
    'assets/КАР000046_КАР000000135.kml',
    'assets/КАР000046_КАР000000231.kml',
    'assets/КАР000046_КАР000000245.kml',
    'assets/КАР000046_КАР000000304.kml',
    'assets/КАР000046_КАР000000305.kml',
    'assets/КАР000046_КАР000000308.kml',
    'assets/КАР000046_КАР000000334.kml',
    'assets/КАР000046_КАР000000335.kml',
    'assets/КАР000052_КАР000000119.kml',
    'assets/КАР000052_КАР000000233.kml',
    'assets/КАР000052_КАР000000240.kml',
    'assets/КАР000052_КАР000000286.kml',
    'assets/КАР000052_КАР000000287.kml',
    'assets/КАР000052_КАР000000288.kml',
    'assets/КАР000052_КАР000000291.kml',
    'assets/КАР000052_КАР000000292.kml',
    'assets/КАР000052_КАР000000293.kml',
    'assets/КАР000052_КАР000000294.kml',
    'assets/КАР000052_КАР000000296.kml',
    'assets/КАР000052_КАР000000297.kml',
    'assets/КАР000052_КАР000000299.kml',
    'assets/КАР000060_КАР000000300.kml',
    'assets/КАР000060_КАР000000301.kml',
    'assets/КАР000060_КАР000000302.kml',
    'assets/КАР000074_КАР000000001.kml',
    'assets/КАР000074_КАР000000002.kml',
    'assets/КАР000074_КАР000000003.kml',
    'assets/КАР000074_КАР000000004.kml',
    'assets/КАР000074_КАР000000005.kml',
    'assets/КАР000074_КАР000000006.kml',
    'assets/КАР000074_КАР000000007.kml',
    'assets/КАР000074_КАР000000008.kml',
    'assets/КАР000074_КАР000000009.kml',
    'assets/КАР000074_КАР000000010.kml',
    'assets/КАР000074_КАР000000011.kml',
    'assets/КАР000074_КАР000000012.kml',
    'assets/КАР000074_КАР000000013.kml',
    'assets/КАР000074_КАР000000014.kml',
    'assets/КАР000074_КАР000000015.kml',
    'assets/КАР000074_КАР000000016.kml',
    'assets/КАР000079_КАР000000094.kml',
    'assets/КАР000079_КАР000000095.kml',
    'assets/КАР000079_КАР000000096.kml',
    'assets/КАР000079_КАР000000097.kml',
    'assets/КАР000079_КАР000000098.kml',
    'assets/КАР000079_КАР000000099.kml',
    'assets/КАР000079_КАР000000100.kml',
    'assets/КАР000079_КАР000000311.kml',
    'assets/КАР000079_КАР000000327.kml',
    'assets/КАР000084_КАР000000053.kml',
    'assets/КАР000084_КАР000000054.kml',
    'assets/КАР000084_КАР000000055.kml',
    'assets/КАР000084_КАР000000056.kml',
    'assets/КАР000084_КАР000000057.kml',
    'assets/КАР000084_КАР000000058.kml',
    'assets/КАР000084_КАР000000059.kml',
    'assets/КАР000084_КАР000000060.kml',
    'assets/КАР000084_КАР000000061.kml',
    'assets/КАР000084_КАР000000062.kml',
    'assets/КАР000084_КАР000000063.kml',
    'assets/КАР000084_КАР000000066.kml',
    'assets/КАР000084_КАР000000067.kml',
    'assets/КАР000084_КАР000000068.kml',
    'assets/КАР000084_КАР000000069.kml',
    'assets/КАР000084_КАР000000070.kml',
    'assets/КАР000084_КАР000000071.kml',
    'assets/КАР000084_КАР000000072.kml',
    'assets/КАР000084_КАР000000073.kml',
    'assets/КАР000084_КАР000000074.kml',
    'assets/КАР000084_КАР000000075.kml',
    'assets/КАР000084_КАР000000076.kml',
    'assets/КАР000084_КАР000000079.kml',
    'assets/КАР000084_КАР000000080.kml',
    'assets/КАР000084_КАР000000081.kml',
    'assets/КАР000084_КАР000000082.kml',
    'assets/КАР000084_КАР000000083.kml',
    'assets/КАР000084_КАР000000084.kml',
    'assets/КАР000084_КАР000000086.kml',
    'assets/КАР000084_КАР000000087.kml',
    'assets/КАР000084_КАР000000088.kml',
    'assets/КАР000084_КАР000000090.kml',
    'assets/КАР000084_КАР000000091.kml',
    'assets/КАР000084_КАР000000092.kml',
    'assets/КАР000084_КАР000000093.kml',
    'assets/КАР000100_КАР000000017.kml',
    'assets/КАР000100_КАР000000018.kml',
    'assets/КАР000100_КАР000000020.kml',
    'assets/КАР000100_КАР000000021.kml',
    'assets/КАР000100_КАР000000022.kml',
    'assets/КАР000100_КАР000000023.kml',
    'assets/КАР000100_КАР000000024.kml',
    'assets/КАР000100_КАР000000025.kml',
    'assets/КАР000100_КАР000000026.kml',
    'assets/КАР000100_КАР000000027.kml',
    'assets/КАР000100_КАР000000028.kml',
    'assets/КАР000100_КАР000000029.kml',
    'assets/КАР000100_КАР000000030.kml',
    'assets/КАР000100_КАР000000031.kml',
    'assets/КАР000100_КАР000000032.kml',
    'assets/КАР000100_КАР000000033.kml',
    'assets/КАР000100_КАР000000034.kml',
    'assets/КАР000100_КАР000000035.kml',
    'assets/КАР000100_КАР000000036.kml',
    'assets/КАР000100_КАР000000037.kml',
    'assets/КАР000100_КАР000000038.kml',
    'assets/КАР000100_КАР000000039.kml',
    'assets/КАР000100_КАР000000040.kml',
    'assets/КАР000100_КАР000000041.kml',
    'assets/КАР000100_КАР000000043.kml',
    'assets/КАР000100_КАР000000322.kml',
    'assets/КАР000100_КАР000000323.kml',
    'assets/КАР000100_КАР000000324.kml',
    'assets/КАР000100_КАР000000325.kml',
    'assets/КАР000100_КАР000000326.kml',
    'assets/КАР000502_КАР000000045.kml',
    'assets/КАР000502_КАР000000048.kml',
    'assets/КАР000502_КАР000000049.kml',
    'assets/КАР000502_КАР000000051.kml',
    'assets/КАР000502_КАР000000064.kml',
    'assets/КАР000502_КАР000000065.kml',
    'assets/КАР000502_КАР000000077.kml',
    'assets/КАР000502_КАР000000078.kml',
    'assets/КАР000502_КАР000000085.kml',
    'assets/КАР000502_КАР000000089.kml',
    'assets/КАР000502_КАР000000216.kml',
    'assets/КАР000502_КАР000000218.kml',
    'assets/КАР000502_КАР000000220.kml',
    'assets/КАР000502_КАР000000224.kml'
  ];

  constructor(private readonly http: HttpClient,
              private readonly resource: MapsResource) {
    this.res = new BehaviorSubject<RES[]>([]);
    this.selectedPowerLine = new BehaviorSubject<PowerLine>(null);
    this.layers = [];

    /**
     * Формат загружаемых ресурсов
     */
    this.format = new KML({
      extractStyles: true,
      defaultStyles: false,
      showPointNames: false
    });


    this.resFormat = new GeoJSON({
      // dataProjection: 'EPSG:3857',
      // featureProjection: 'EPSG:4326',
      extractStyles: false,
      defaultStyles: true,
      showPointNames: true
    });

    /**
     * Ресурс подложки
     */
    this.tileSource = new XYZ({
      url: 'http://10.50.0.172/hot/{z}/{x}/{y}.png',
      useSpatialIndex: true
    });

    /**
     * Слой подложки
     */
    this.tileLayer = new TileLayer({
      zIndex: 1,
      source: this.tileSource
    });
    this.layers.push(this.tileLayer);

    /**
     * Ресурс РЭС
     */

    /*
    this.resSource = new Vector({
      url: 'http://10.50.0.16:8080/geoserver/karel/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=karel:res&maxFeatures=50&outputFormat=application%2Fjson',
      format: this.resFormat,
      useSpatialIndex: true
    });
    */


    /**
     * Слой РЭС
     */
    /*
    this.resLayer = new VectorLayer({
      source: this.resSource,
      zIndex: 2
    });

    this.layers.push(this.resLayer);
    */


    /**
     * Вид и проекуия карты
     */
    this.view = new View({
      center: [4664211, 8741020],
      // projection: 'EPSG:3857',
      zoom: 7
    });
  }

  fetchResGeometry(): Observable<void> {
    return fromPromise(this.resource.getRes())
      .pipe(
        map((data: any) => {
          this.resSource = new Vector({
            format: this.resFormat,
            features: this.resFormat.readFeatures(data, {
              featureProjection: 'EPSG:3857'
            }),
            useSpatialIndex: true
          });
          this.resLayer = new VectorLayer({
            source: this.resSource,
            zIndex: 2
          });
          this.layers.push(this.resLayer);
        })
      );
  }

  fetchInitialData(): Observable<RES[]> {
    return this.http.post('http://localhost:7777', null)
      .pipe(
        map((data: IRes[]) => {
          const result = [];
          data.forEach((item: IRes) => {
            const res = new RES(item);
            result.push(res);
            this.urls.forEach((url: string) => {
              if (url.indexOf(res.id) !== -1) {
                res.lines.forEach((line: PowerLine) => {
                  if (url.indexOf(line.id) !== -1) {
                    const source = new Vector({
                      url: url,
                      format: this.format,
                      useSpatialIndex: true
                    });
                    const layer = new VectorLayer({
                      source: source,
                      zIndex: 6
                    });
                    layer.setVisible(false);
                    line.layer = layer;
                    line.source = source;
                    // this.layers.push(layer);
                  }
                });
              }
            });
            this.resSource.getFeatures().forEach((feature: Feature) => {
              if (feature.getId().indexOf(res.id) !== -1) {
                res.feature = feature;
              }
            });
          });
          this.res.next(result);
          return this.res.value;
        })
      );
  }

  getRes(): Observable<RES[]> {
    return this.res.asObservable();
  }

  selectPowerLine(line?: PowerLine): Observable<PowerLine | null> {
    if (line) {
      this.selectedPowerLine.next(line);
    }
    return this.selectedPowerLine.asObservable();
  }
}
