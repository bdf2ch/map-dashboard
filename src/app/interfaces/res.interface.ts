import { IPowerLine } from './power-line.interface';

export interface IRes {
  id: string;
  title: string;
  region: string;
  lines: IPowerLine[];
}
