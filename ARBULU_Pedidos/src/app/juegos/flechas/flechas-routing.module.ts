import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlechasPage } from './flechas.page';

const routes: Routes = [
  {
    path: '',
    component: FlechasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlechasPageRoutingModule {}
