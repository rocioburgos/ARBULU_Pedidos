import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UtilidadesService } from './utilidades.service';
import { Usuario } from '../clases/usuario';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  public usuarioLogueado = new Usuario();
  public logueado = false;
  public usuario$: Observable<any> = this.afAuth.user;
  private email: string;
  public usuarioActual: any;
  private usuarios:any;
  constructor(
    public afAuth: AngularFireAuth,
    private utilidadesSrv: UtilidadesService,
    public ngZone: NgZone,
    public router: Router,
    private firestoreSvc: FirestoreService) {

    console.log(this.usuario$);
    this.usuario$.subscribe(result => {
      if(result!= null)
      {
         this.email = result['email'];
          this.firestoreSvc.obtenerColeccionUsuario().subscribe(usuarios => {
            usuarios.forEach(usuario => {
              //console.log(usuario);
              if(usuario.email == this.email){
                this.usuarioActual = usuario;
                console.log(this.usuarioActual);
              }
            })
          });
      }
    });


    this.firestoreSvc.obtenerColeccionUsuario().subscribe((res)=>{
      this.usuarios= res;
    });
 
   }

  async Register(email: string, password: string) {
    try {
      const result = await this.afAuth
        .createUserWithEmailAndPassword(email, password);
        this.ngZone.run(() => {
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
        this.usuarios.forEach(user => {

          if(user.email== email){
           localStorage.setItem('usuario_ARBULU', JSON.stringify(
                                                                  {  'email': this.email, 
                                                                     'sesion': 'activa',
                                                                     'tipo':user.tipo,
                                                                     'tipoEmpleado':user.tipoEmpleado  }));
          }
       });
        this.utilidadesSrv.successToast("Ingreso exitoso.",2000);//SACAR EL TOAST DE ACA Y PONERLO EN LA PAGINA
        this.router.navigate(['home']);
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
 

  public signIn(mail: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(mail, password);
  }

  public register(mail: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(mail, password);
  }

  public signOut() {
    this.usuarioLogueado = new Usuario();
    this.logueado = false;
    localStorage.removeItem('usuario_ARBULU');
    this.router.navigate(['/login']);
    return this.afAuth.signOut();
  }

  getCurrentUserFirebase(): Observable<any>{
    return this.afAuth.authState;
   }
}
