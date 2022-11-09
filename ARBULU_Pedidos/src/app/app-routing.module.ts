import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ClienteAprobadoGuard } from './guards/cliente-aprobado.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [ClienteAprobadoGuard]
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
    path: 'qr-ingreso-local',
    loadChildren: () => import('./qr-ingreso-local/qr-ingreso-local.module').then( m => m.QrIngresoLocalPageModule)
  },
  {
    path: 'home-cliente',
    loadChildren: () => import('./home-cliente/home-cliente.module').then( m => m.HomeClientePageModule)
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
  },  
  {
    path: 'listado-pedidos',
    loadChildren: () => import('./listado-pedidos/listado-pedidos.module').then( m => m.ListadoPedidosPageModule)
  },  
  {
    path: 'home-metre',
    loadChildren: () => import('./home-metre/home-metre.module').then( m => m.HomeMetrePageModule)
  },  
  {
    path: 'home-empleado',
    loadChildren: () => import('./home-empleados/home-empleados.module').then( m => m.HomeEmpleadosPageModule)
  },  
  {
    path: 'home-duenio',
    loadChildren: () => import('./home-duenio/home-duenio.module').then( m => m.HomeDuenioPageModule)
  },
  {
    path: 'listado-clientes-pendientes',
    loadChildren: () => import('./listado-clientes-pendientes/listado-clientes-pendientes.module').then( m => m.ListadoClientesPendientesPageModule)
  },
  {
    path: 'encuesta-cliente',
    loadChildren: () => import('./encuesta-cliente/encuesta-cliente.module').then( m => m.EncuestaClientePageModule)
  }


 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
