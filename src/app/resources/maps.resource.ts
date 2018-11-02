import { Injectable } from '@angular/core';
import { IResourceMethod, Resource, ResourceAction, ResourceHandler, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';
import { environment } from '../../environments/environment';

@Injectable()
@ResourceParams({
  pathPrefix: environment.geoServerUrl,
  params: {
    service: 'WFS',
    version: '1.0.0',
    request: 'getFeature',
    typeName: 'karel:res',
    maxFeatures: 50,
    outputFormat: encodeURI('application/json')
  }
})
export class MapsResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    path: '',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  getRes: IResourceMethod<void, any>;
}
