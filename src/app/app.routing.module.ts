import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { ResolveGuard } from './guards/resolve.guard';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    resolve: [
      ResolveGuard
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
