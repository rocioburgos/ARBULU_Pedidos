import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mesa } from '../clases/mesa';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private usuariosRef: AngularFirestoreCollection;
  private mesasRef: AngularFirestoreCollection;
  public usuarioActual: any;

  constructor(private db: AngularFirestore) {
    this.usuariosRef = this.db.collection('usuarios');
    this.mesasRef = this.db.collection('mesas');
  }

  public crearUsuario(usuario: Usuario) {
    return this.usuariosRef.add({ ...usuario }).then((data)=>{
      this.update(data.id, { uid: data.id });
    });
  }

  public crearMesa(mesa: Mesa) {
    return this.mesasRef.add({ ...mesa }).then((data)=>{
      this.updateMesa(data.id, { uid: data.id });
    });
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

  public obtenerColeccionMesas() {
    return this.mesasRef.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a: any) => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  public obtenerMesas() {
    return this.mesasRef.valueChanges() as Observable<Object[]>;
  }

  public updateMesa(id: string, data: any) {
    return this.mesasRef.doc(id).update(data);
  }
   
}
