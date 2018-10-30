import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MapsService {

  constructor(private readonly http: HttpClient) {}

  getInitData(): Observable<any[]> {
    const result = this.http.get('http://localhost:7777/');
  }
}
