import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MapsService } from '../services/maps.service';

@Injectable()
export class DataResolveGuard implements Resolve<any> {
  constructor(private readonly map: MapsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>  {
    return this.map.fetchInitialData();
  }
}
