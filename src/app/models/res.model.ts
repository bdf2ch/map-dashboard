import Feature from 'ol/Feature';

export class RES {
  id: string;
  title: string;
  feature: Feature;
  isOpened: boolean;

  constructor(id: string, title: string, feature: Feature) {
    this.id = id;
    this.title = title;
    this.feature = feature;
    this.isOpened = false;
  }
}
