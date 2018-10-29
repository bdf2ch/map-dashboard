import Feature from 'ol/Feature';
import Layer from 'ol/layer';

export class PowerLine {
  title: string;
  voltage: string;
  feature: Feature;
  layer: Layer;

  constructor(title: string, voltage: string, feature: Feature, layer: Layer) {
    this.title = title;
    this.voltage = voltage;
    this.feature = feature;
    this.layer = layer;
  }
}

