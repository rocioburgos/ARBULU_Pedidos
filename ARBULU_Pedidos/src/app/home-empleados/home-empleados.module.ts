import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeEmpleadosPageRoutingModule } from './home-empleados-routing.module';

import { HomeEmpleadosPage } from './home-empleados.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeEmpleadosPageRoutingModule,
    NgxSpinnerModule
  ],
  declarations: [HomeEmpleadosPage]
})
export class HomeEmpleadosPageModule {}
