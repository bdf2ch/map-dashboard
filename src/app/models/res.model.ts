import Feature from 'ol/Feature';
import { PowerLine } from './power-line.model';
import { IRes } from '../interfaces/res.interface';
import { IPowerLine } from '../interfaces/power-line.interface';

export class RES {
  id: string;
  title: string;
  region: string;
  length: number;
  planGa: number;
  factGa: number;
  lines: PowerLine[];
  feature: Feature;
  isOpened: boolean;

  constructor(config?: IRes) {
    this.id = config ? config.id : null;
    this.title = config ? config.title : null;
    this.region = config ? config.region : null;
    this.planGa = 0;
    this.factGa = 0;
    this.length = 0;
    this.lines = [];
    this.feature = null;
    this.isOpened = false;
    if (config) {
      config.lines.forEach((item: IPowerLine) => {
        const line = new PowerLine(item);
        this.length += line.length;
        this.length = +this.length.toFixed(1);
        this.planGa += line.planGa;
        this.factGa += line.factGa;
        this.lines.push(line);
      });
    }
  }

  /**
   * Включение отображения всех слоев РЭС'а
   */
  turnOnLayers() {
    this.lines.forEach((line: PowerLine) => {
      line.layer.setVisible(true);
    });
  }

  /**
   * Выключение отображения всех слоев РЭС'а
   */
  turnOffLayers() {
    this.lines.forEach((line: PowerLine) => {
      line.layer.setVisible(false);
    });
  }
}
