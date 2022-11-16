import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoClientesPendientesPageRoutingModule } from './listado-clientes-pendientes-routing.module';

import { ListadoClientesPendientesPage } from './listado-clientes-pendientes.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule,
    ListadoClientesPendientesPageRoutingModule
  ],
  declarations: [ListadoClientesPendientesPage]
})
export class ListadoClientesPendientesPageModule {}
