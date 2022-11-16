import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlechasPageRoutingModule } from './flechas-routing.module';

import { FlechasPage } from './flechas.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule,
    FlechasPageRoutingModule
  ],
  declarations: [FlechasPage]
})
export class FlechasPageModule {}
