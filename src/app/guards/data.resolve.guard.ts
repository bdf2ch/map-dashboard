import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MapsService } from '../services/maps.service';

@Injectable()
export class DataResolveGuard implements Resolve<void> {
  constructor(private readonly map: MapsService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void>  {
    await this.map.fetchResGeometry().toPromise();
    await this.map.fetchInitialData().toPromise();
  }
}
