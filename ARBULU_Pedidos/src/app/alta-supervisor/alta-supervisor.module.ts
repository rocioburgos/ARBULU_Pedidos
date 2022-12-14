import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaSupervisorPageRoutingModule } from './alta-supervisor-routing.module';

import { AltaSupervisorPage } from './alta-supervisor.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AltaSupervisorPageRoutingModule,
    NgxSpinnerModule
  ],
  declarations: [AltaSupervisorPage]
})
export class AltaSupervisorPageModule {}
