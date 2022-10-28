import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UtilidadesService } from './utilidades.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth, private utilidadesSrv: UtilidadesService, public ngZone: NgZone, public router: Router) { }

  async Register(email: string, password: string) {
    try {
      const result = await this.afAuth
        .createUserWithEmailAndPassword(email, password);
        this.ngZone.run(() => {
          this.router.navigate(['home']);
          this.utilidadesSrv.successToast("Registro exitoso.",2000);
        });
    } catch (error:any) {
      this.Errores(error.message);
    }
  }

  async Login(email:string, pass: string){
    try {
      const result = await this.afAuth
        .signInWithEmailAndPassword(email, pass);
      this.ngZone.run(() => {
        this.router.navigate(['home']);
        this.utilidadesSrv.successToast("Ingreso exitoso.",2000);
      });

    } catch (error:any) {
      console.log(error.code);
      this.Errores(error.code);
    }
  }
  
  Errores(error:any)
  {
    if(error.code == 'auth/email-already-in-use')
      {
        this.utilidadesSrv.errorToast('El correo ya está en uso.');
      }
      else if(error.code == 'auth/missing-email' || error.code == 'auth/internal-error')
      {
        this.utilidadesSrv.errorToast('No pueden quedar campos vacíos');
      }
      else if(error.code == 'auth/weak-password')
      {
        this.utilidadesSrv.errorToast('La contraseña debe tener al menos 8 caracteres');
      }
      else
      {
        this.utilidadesSrv.errorToast('Correo o contraseña invalidos');
      }
    }
}
