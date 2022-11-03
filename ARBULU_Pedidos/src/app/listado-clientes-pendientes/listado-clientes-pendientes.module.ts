import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoClientesPendientesPageRoutingModule } from './listado-clientes-pendientes-routing.module';

import { ListadoClientesPendientesPage } from './listado-clientes-pendientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoClientesPendientesPageRoutingModule
  ],
  declarations: [ListadoClientesPendientesPage]
})
export class ListadoClientesPendientesPageModule {}
