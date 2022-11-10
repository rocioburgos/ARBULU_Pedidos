import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
import { JuegoCartasPage } from './juego-cartas.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoCartasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegoCartasPageRoutingModule {}
