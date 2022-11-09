import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaSupervisorPageRoutingModule } from './encuesta-supervisor-routing.module';

import { EncuestaSupervisorPage } from './encuesta-supervisor.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaSupervisorPageRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  declarations: [EncuestaSupervisorPage]
})
export class EncuestaSupervisorPageModule {}
