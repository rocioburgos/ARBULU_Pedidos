import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private usuariosRef: AngularFirestoreCollection;

  constructor(private db: AngularFirestore) {
    this.usuariosRef = this.db.collection('usuarios');
  }

  public crearUsuario(usuario: Usuario) {
    return this.usuariosRef.add({ ...usuario });
  }

  public obtenerUsuario() {
    return this.usuariosRef.valueChanges() as Observable<Object[]>;
  }

  public update(id: string, data: any) {
    return this.usuariosRef.doc(id).update(data);
  }

  public delete(id: string) {
    return this.usuariosRef.doc(id).delete();
  }

  public obtenerColeccionUsuario() {
    return this.usuariosRef.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a: any) => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }
}
