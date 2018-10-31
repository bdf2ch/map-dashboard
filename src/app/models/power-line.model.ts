import Layer from 'ol/layer';
import Vector from 'ol/source';
import { IPowerLine } from '../interfaces/power-line.interface';

export class PowerLine {
  id: string;
  title: string;
  voltage: string;
  length: number;
  planGa: number;
  factGa: number;
  planKm: number;
  factKm: number;
  brigades: number;
  people: number;
  machines: number;
  layer: Layer;
  source: Vector;

  constructor(config?: IPowerLine) {
    this.id = config ? config.id : null;
    this.title = config ? config.title : null;
    this.voltage = config ? config.voltage : null;
    this.length = config ? Number(config.length) : 0;
    this.planGa = config ? Number(config.planGa) : 0;
    this.factGa = config ? Number(config.factGa) : 0;
    this.planKm = config ? Number(config.planKm) : 0;
    this.factKm = config ? Number(config.factKm) : 0;
    this.brigades = config ? Number(config.brigades) : 0;
    this.people = config ? Number(config.people) : 0;
    this.machines = config ? Number(config.machines) : 0;
    this.layer = null;
    this.source = null;
  }
}

