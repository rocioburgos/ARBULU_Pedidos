import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteAprobadoGuard implements CanActivate {
  usuarioActual:any;
  constructor(private fireSrv:FirestoreService){

    //traigo todos los usuarios
    //traigo el usuario de mi ls
    //usar variables aca para que funcione 
    const userJson =  JSON.parse(localStorage.getItem('usuario_ARBULU'));  
   
    this.fireSrv.obtenerColeccionUsuario().subscribe((usuarios)=>{
      usuarios.forEach(user => {
        if(user.uid == userJson.uid){
          this.usuarioActual= user;
        }
       });
    })
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if(this.usuarioActual.tipo != 'cliente')
    {
      return true;
    }
    else if(this.usuarioActual.tipo == 'cliente')
    {
      if(this.usuarioActual.clienteValidado == 'aceptado')
      {
        return true;
      }
      else{
        return false;
      }
    } 

    return false
  }
  
}
