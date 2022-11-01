import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SectorElaboracionPageRoutingModule } from './sector-elaboracion-routing.module';

import { SectorElaboracionPage } from './sector-elaboracion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SectorElaboracionPageRoutingModule
  ],
  declarations: [SectorElaboracionPage]
})
export class SectorElaboracionPageModule {}
