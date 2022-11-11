import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoPedidosPageRoutingModule } from './listado-pedidos-routing.module';

import { ListadoPedidosPage } from './listado-pedidos.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoPedidosPageRoutingModule,
    NgxSpinnerModule
  ],
  declarations: [ListadoPedidosPage]
})
export class ListadoPedidosPageModule {}
