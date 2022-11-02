import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'alta-empleado',
    loadChildren: () => import('./alta-empleado/alta-empleado.module').then( m => m.AltaEmpleadoPageModule)
  },
  {
    path: 'alta-producto',
    loadChildren: () => import('./alta-producto/alta-producto.module').then( m => m.AltaProductoPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'alta-supervisor',
    loadChildren: () => import('./alta-supervisor/alta-supervisor.module').then( m => m.AltaSupervisorPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'alta-clientes',
    loadChildren: () => import('./alta-clientes/alta-clientes.module').then( m => m.AltaClientesPageModule)
  },
  {
    path: 'alta-mesa',
    loadChildren: () => import('./alta-mesa/alta-mesa.module').then( m => m.AltaMesaPageModule)
  },
  {
    path: 'listado-productos',
    loadChildren: () => import('./listado-productos/listado-productos.module').then( m => m.ListadoProductosPageModule)
  },
  {
    path: 'carta-productos',
    loadChildren: () => import('./carta-productos/carta-productos.module').then( m => m.CartaProductosPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'sector-elaboracion',
    loadChildren: () => import('./sector-elaboracion/sector-elaboracion.module').then( m => m.SectorElaboracionPageModule)
  },
  {
    path: 'detalle-pedido',
    loadChildren: () => import('./detalle-pedido/detalle-pedido.module').then( m => m.DetallePedidoPageModule)
  },  {
    path: 'listado-pedidos',
    loadChildren: () => import('./listado-pedidos/listado-pedidos.module').then( m => m.ListadoPedidosPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
