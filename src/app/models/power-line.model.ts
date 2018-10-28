import Feature from 'ol/Feature';

export class PowerLine {
  title: string;
  voltage: string;
  feature: Feature;

  constructor(title: string, voltage: string, feature: Feature) {
    this.title = title;
    this.voltage = voltage;
    this.feature = feature;
  }
}

