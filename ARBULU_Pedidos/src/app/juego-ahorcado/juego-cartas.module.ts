import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular'; 
import { JuegoCartasPageRoutingModule } from './juego-cartas-routing.module';
import { JuegoCartasPage } from './juego-cartas.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule,
    JuegoCartasPageRoutingModule
  ],
  declarations: [JuegoCartasPage]
})
export class JuegoAhorcadoPageModule {}
