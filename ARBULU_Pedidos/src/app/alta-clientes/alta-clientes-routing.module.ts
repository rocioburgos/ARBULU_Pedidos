import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaClientesPage } from './alta-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: AltaClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaClientesPageRoutingModule {}
