import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteAprobadoGuard implements CanActivate {

  constructor(private auth:AuthService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if(this.auth.usuarioActual.tipo != 'cliente')
    {
      return true;
    }
    else if(this.auth.usuarioActual.tipo == 'cliente')
    {
      if(this.auth.usuarioActual.clienteValidado == true)
      {
        return true;
      }
      else{
        return false;
      }
    }
  }
  
}
