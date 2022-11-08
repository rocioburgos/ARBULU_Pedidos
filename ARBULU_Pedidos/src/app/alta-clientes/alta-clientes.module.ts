import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaClientesPageRoutingModule } from './alta-clientes-routing.module';

import { AltaClientesPage } from './alta-clientes.page';
import { NgxSpinnerModule } from "ngx-spinner";  

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaClientesPageRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  declarations: [AltaClientesPage]
})
export class AltaClientesPageModule {}
