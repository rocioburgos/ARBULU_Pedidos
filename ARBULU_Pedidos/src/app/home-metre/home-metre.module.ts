import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMetrePageRoutingModule } from './home-metre-routing.module';

import { HomeMetrePage } from './home-metre.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeMetrePageRoutingModule,
    NgxSpinnerModule
  ],
  declarations: [HomeMetrePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeMetrePageModule {}
