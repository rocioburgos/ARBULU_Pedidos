import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UtilidadesService } from './utilidades.service';
import { Usuario } from '../clases/usuario';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usuarioLogueado = new Usuario();
  public logueado = false;
  public usuario$: Observable<any> = this.afAuth.user;
  private email: string;
  public usuarioActual: any;
  private usuarios: any;

  constructor(
    public afAuth: AngularFireAuth,
    private utilidadesSrv: UtilidadesService,
    public ngZone: NgZone,
    public router: Router,
    private firestoreSvc: FirestoreService,
    private notiSrv:NotificationService) {

    console.log(this.usuario$);
    this.usuario$.subscribe(result => {
      if (result != null) {
        this.email = result['email'];
        if (this.email) {
          this.firestoreSvc.obtenerColeccionUsuario().subscribe(usuarios => {
            usuarios.forEach(usuario => {
              //console.log(usuario);
              if (usuario.email == this.email) {
                this.usuarioActual = usuario;
                console.log(this.usuarioActual);
              }
            })
          });
        }
      }
    });


    this.firestoreSvc.obtenerColeccionUsuario().subscribe((res) => {
      this.usuarios = res;
    });
    
  }

  async Register(email: string, password: string) {
    try {
      const result = await this.afAuth
        .createUserWithEmailAndPassword(email, password);
      this.ngZone.run(() => {
        this.utilidadesSrv.successToast("Registro exitoso.", 2000);
      });
    } catch (error: any) {
      this.Errores(error.message);
    }
  }

  SignIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

 

  async Login(email: string, pass: string) {
    try {
      const result = await this.afAuth
        .signInWithEmailAndPassword(email, pass);
      this.ngZone.run(() => {
        this.usuarios.forEach(user => {
          //console.log(user);
          
          if (user.email == email) {
            this.usuarioActual = user;
            //console.log(this.usuarioActual);
            
            localStorage.setItem('usuario_ARBULU', JSON.stringify(
              {
                'uid': user.uid,
                'email': this.email,
                'sesion': 'activa',
                'tipo': user.tipo,
                'tipoEmpleado': user.tipoEmpleado
              }));

              this.notiSrv.RegisterFCM(user.uid)
          }
 
        }); 
      });

    } catch (error: any) {
      console.log(error.code);
      this.Errores(error.code);
    }
  }

  Errores(error: any) {
    if (error.code == 'auth/email-already-in-use') {
      this.utilidadesSrv.errorToast('El correo ya está en uso.');
    }
    else if (error.code == 'auth/missing-email' || error.code == 'auth/internal-error') {
      this.utilidadesSrv.errorToast('No pueden quedar campos vacíos');
    }
    else if (error.code == 'auth/weak-password') {
      this.utilidadesSrv.errorToast('La contraseña debe tener al menos 8 caracteres');
    }
    else {
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
     //eliminar el token de la coleccion usuarios 
        // usuario_actual?.uid
        /*this.firestoreSvc.obtenerUsuarioPorId(usuario_actual?.uid).then((user:any)=>{
          user.token=''; 
          this.firestoreSvc.update( user.doc_id, user)
        })*/
      //  this.firestoreSvc.update( usuario_actual?.uid, {token:''})

      
        localStorage.removeItem('usuario_ARBULU'); 
        localStorage.removeItem('pedido');
  
      return this.afAuth.signOut();
  }

  getCurrentUserFirebase(): Observable<any> {
    return this.afAuth.authState;
  }

  getCurrentUserLS(): any{
    const userJson = localStorage.getItem('usuario_ARBULU');  
    if(userJson != null  ){
    return JSON.parse(userJson); 
    }else{
      return null;
    }
    }



    async registro(email: string, password: string) {
      try {
       return await this.afAuth
          .createUserWithEmailAndPassword(email, password);
        
      } catch (error: any) {
        this.Errores(error.message);
      }
    }
}