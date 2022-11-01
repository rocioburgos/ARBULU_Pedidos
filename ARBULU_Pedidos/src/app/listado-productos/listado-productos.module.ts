import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoProductosPageRoutingModule } from './listado-productos-routing.module';

import { ListadoProductosPage } from './listado-productos.page';
import { SwiperModule } from 'swiper/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoProductosPageRoutingModule,
    SwiperModule
  ],
  declarations: [ListadoProductosPage]
})
export class ListadoProductosPageModule {}
