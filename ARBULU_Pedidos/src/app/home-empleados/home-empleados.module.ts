import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeEmpleadosPageRoutingModule } from './home-empleados-routing.module';

import { HomeEmpleadosPage } from './home-empleados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeEmpleadosPageRoutingModule
  ],
  declarations: [HomeEmpleadosPage]
})
export class HomeEmpleadosPageModule {}
