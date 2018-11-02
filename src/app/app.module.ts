import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { ResGeometryResolveGuard } from './guards/res-geometry.resolve.guard';
import { MapsService } from './services/maps.service';
import { MapsResource } from './resources/maps.resource';
import { DataResolveGuard } from './guards/data.resolve.guard';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatExpansionModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    MapsService,
    ResGeometryResolveGuard,
    MapsResource,
    DataResolveGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly matIconRegistry: MatIconRegistry) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    matIconRegistry.registerFontClassAlias('fortawesome', 'fas');
    matIconRegistry.registerFontClassAlias('fortawesome', 'far');
  }
}
