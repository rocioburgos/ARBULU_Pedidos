import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PokePreguntadosPageRoutingModule } from './poke-preguntados-routing.module';

import { PokePreguntadosPage } from './poke-preguntados.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PokePreguntadosPageRoutingModule,
    NgxSpinnerModule
  ],
  declarations: [PokePreguntadosPage]
})
export class PokePreguntadosPageModule {}
