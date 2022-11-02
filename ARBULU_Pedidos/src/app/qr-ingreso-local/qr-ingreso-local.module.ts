import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrIngresoLocalPageRoutingModule } from './qr-ingreso-local-routing.module';

import { QrIngresoLocalPage } from './qr-ingreso-local.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrIngresoLocalPageRoutingModule
  ],
  declarations: [QrIngresoLocalPage]
})
export class QrIngresoLocalPageModule {}
