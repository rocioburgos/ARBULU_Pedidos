import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogueadoGuard implements CanActivate {


  constructor(private route: Router, private authSrv: AuthService) {
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    var usuario = this.authSrv.getCurrentUserLS();
    if (usuario == null) {
      //this.route.navigate(['login']);
      console.log('usuario NO logueado');
      return true;
    } else {
      console.log('usuario ya logueado');
      
      switch (usuario.tipo) {
        case 'cliente':
          this.route.navigate(['qr-ingreso-local']);
          break;
        case 'dueño':
          this.route.navigate(['home-duenio']);
          break;
        case 'supervisor':
          this.route.navigate(['home-duenio']);
          break;
        case 'empleado':
          this.route.navigate(['home-empleado']);
          break;
      }
      return false;
    }

  }
}
