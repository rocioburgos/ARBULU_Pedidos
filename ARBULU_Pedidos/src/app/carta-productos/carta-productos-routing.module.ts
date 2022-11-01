import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartaProductosPage } from './carta-productos.page';

const routes: Routes = [
  {
    path: '',
    component: CartaProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartaProductosPageRoutingModule {}
