import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaEmpleadoPageRoutingModule } from './encuesta-empleado-routing.module';

import { EncuestaEmpleadoPage } from './encuesta-empleado.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaEmpleadoPageRoutingModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ],
  declarations: [EncuestaEmpleadoPage]
})
export class EncuestaEmpleadoPageModule {}
