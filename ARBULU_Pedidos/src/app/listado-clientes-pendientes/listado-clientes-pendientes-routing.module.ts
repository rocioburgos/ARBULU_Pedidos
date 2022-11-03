import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoClientesPendientesPage } from './listado-clientes-pendientes.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoClientesPendientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoClientesPendientesPageRoutingModule {}
