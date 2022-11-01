import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SectorElaboracionPage } from './sector-elaboracion.page';

const routes: Routes = [
  {
    path: '',
    component: SectorElaboracionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectorElaboracionPageRoutingModule {}
