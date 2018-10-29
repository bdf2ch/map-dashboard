import Feature from 'ol/Feature';
import { PowerLine } from './power-line.model';

export class RES {
  id: string;
  title: string;
  feature: Feature;
  isOpened: boolean;
  lines: PowerLine[];

  constructor(id: string, title: string, feature: Feature) {
    this.id = id;
    this.title = title;
    this.feature = feature;
    this.isOpened = false;
    this.lines = [];
  }
}
