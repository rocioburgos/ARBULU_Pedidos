import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from '../clases/usuario';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usuarioLogueado = new Usuario();
  public logueado = false;

  constructor(private afAuth: AngularFireAuth) {}

  public signIn(mail: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(mail, password);
  }

  public register(mail: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(mail, password);
  }

  public signOut() {
    this.usuarioLogueado = new Usuario();
    this.logueado = false;
    return this.afAuth.signOut();
  }
}
