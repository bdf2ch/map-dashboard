import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceModule } from '@ngx-resource/handler-ngx-http';
import { MapComponent } from './components/map/map.component';
import { ResGeometryResolveGuard } from './guards/res-geometry.resolve.guard';
import { DataResolveGuard } from './guards/data.resolve.guard';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    resolve: [
      // ResGeometryResolveGuard,
      DataResolveGuard
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ResourceModule.forRoot()
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
