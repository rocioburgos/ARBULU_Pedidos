import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrIngresoLocalPage } from './qr-ingreso-local.page';

const routes: Routes = [
  {
    path: '',
    component: QrIngresoLocalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrIngresoLocalPageRoutingModule {}
