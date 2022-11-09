import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeDuenioPageRoutingModule } from './home-duenio-routing.module';

import { HomeDuenioPage } from './home-duenio.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeDuenioPageRoutingModule,
    NgxSpinnerModule
  ],
  declarations: [HomeDuenioPage]
})
export class HomeDuenioPageModule {}
