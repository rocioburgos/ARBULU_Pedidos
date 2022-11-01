import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartaProductosPageRoutingModule } from './carta-productos-routing.module';

import { CartaProductosPage } from './carta-productos.page';
import { SwiperModule } from 'swiper/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartaProductosPageRoutingModule,
    SwiperModule
  ],
  declarations: [CartaProductosPage]
})
export class CartaProductosPageModule {}
