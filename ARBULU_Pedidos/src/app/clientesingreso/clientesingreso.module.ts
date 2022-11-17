import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesingresoPageRoutingModule } from './clientesingreso-routing.module';

import { ClientesingresoPage } from './clientesingreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesingresoPageRoutingModule
  ],
  declarations: [ClientesingresoPage]
})
export class ClientesingresoPageModule {}
