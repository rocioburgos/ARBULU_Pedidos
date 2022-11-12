import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mesa } from '../clases/mesa';
import { Usuario, eUsuario } from '../clases/usuario';
import { ImagenesService } from './imagenes.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private usuariosRef: AngularFirestoreCollection;
  private mesasRef: AngularFirestoreCollection;
  private encuestasUsuarios: AngularFirestoreCollection;
  public usuarioActual: any;
  private usuariosCollection: AngularFirestoreCollection<any>;
  private encuestasClienteSupervisorRef: AngularFirestoreCollection;
  private encuestasEmpleadoSupervisorRef: AngularFirestoreCollection;
  
  constructor(private db: AngularFirestore,
    private imagenes:ImagenesService) {
    this.usuariosRef = this.db.collection('usuarios');
    this.mesasRef = this.db.collection('mesas');
    this.encuestasClienteSupervisorRef = this.db.collection('encuestas-cliente-supervisor');
    this.encuestasEmpleadoSupervisorRef = this.db.collection('encuestas-empleado-supervisor');
    this.encuestasUsuarios = this.db.collection('encuestaClientes');
  }

  public crearUsuario(usuario: Usuario) {
    return this.usuariosRef.add({ ...usuario }).then((data) => {
      this.update(data.id, { uid: data.id });
      console.log(usuario.email);

      //var anonimo = usuario.email == null ? true : false;
      localStorage.removeItem('usuario_ARBULU');
      localStorage.setItem('usuario_ARBULU', JSON.stringify(
        {
          'uid': data.id,
          'email': usuario.email,
          'sesion': 'activa',
          'tipo': usuario.tipo,
          'tipoEmpleado': usuario.tipoEmpleado
        }));
    });
  }

  public crearMesa(mesa: Mesa) {
    return this.mesasRef.add({ ...mesa }).then((data) => {
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

  public obtenerMesaPorNumero(nroMesa: string) {

    this.mesasRef = this.db.collection('mesas', ref =>
      ref.where('numero', '==', nroMesa)
    );
    return this.mesasRef.valueChanges({ idField: "doc_id" });
  }

  public obtenerMesasOcupadas( ) {

    this.mesasRef = this.db.collection('mesas', ref =>
      ref.where('ocupada', '==', true)
    );
    return this.mesasRef.valueChanges({ idField: "doc_id" });
  }

  public updateMesa(id: string, data: any) {
    return this.mesasRef.doc(id).update(data);
  }

  public obtenerUsuariosPorTipo(tipo: eUsuario) {
    return this.usuariosRef.ref.where('tipoCliente', '==', tipo).get();
  }

  public obtenerUsuariosByTipo(tipo: eUsuario) {
    //return this.usuariosRef.ref.where('tipoCliente', '==', tipo).get();
     this.usuariosRef = this.db.collection('usuarios', ref =>
      ref.where('tipo', '==', tipo));
    return this.usuariosRef.valueChanges({ idField: "uid" });
  }

  public async obtenerClientesInvalidados() {
    return this.usuariosRef.ref.where('tipo', '==', 'cliente').where('clienteValidado', '==', false).get();
  }

  public async obtenerUsuarioPorId(id: string) {
    return this.usuariosRef.ref.where('doc_id', '==', id).get(); 
   /* this.usuariosRef = this.db.collection('usuarios', ref =>  ref.where('uid', '==', id)   ) ;
  return this.usuariosRef.valueChanges({idField: "doc_id"}); */
  }


  
  usuarioPorId(id: string){ 
    this.usuariosCollection =  this.db.collection('usuarios', 
                                      ref => ref.where('uid', '==', id)    
                                    );  
      return this.usuariosCollection.valueChanges({ idField: "doc_id" }); 
 
  }


  getUserByUid(uid:string){
    return this.getItemById(uid);
  }

  protected getItemById(id:string){
    this.usuariosCollection = this.db.collection('usuarios');
    return this.usuariosCollection.doc(id).get();
  }
  
  setItemWithId(item: any, id:string) {
    this.usuariosCollection = this.db.collection('usuarios');
    return this.usuariosCollection.doc(id).set(Object.assign({}, item));    
  }

  async SubirEncuestaCliente(datos: any, fotos: FormData) {
    let path1 = `fotosEncuestas/${Date.now()}/1`;
    let path2 = `fotosEncuestas/${Date.now()}/2`;
    let path3 = `fotosEncuestas/${Date.now()}/3`;

    await this.imagenes.saveFile(fotos.get('foto1'), path1);
    await this.imagenes.saveFile(fotos.get('foto2'), path2);
    await this.imagenes.saveFile(fotos.get('foto3'), path3);

    let storageSub1 = this.imagenes.getRef(path1).subscribe((data1)=>{
      datos.foto1 = data1;
      let storageSub2 = this.imagenes.getRef(path2).subscribe((data2) => {
        datos.foto2 = data2;
        let storageSub3 = this.imagenes.getRef(path3).subscribe((data3) => {
          datos.foto3 = data3;
          this.encuestasUsuarios.add(datos);
          storageSub3.unsubscribe();
        });
        storageSub2.unsubscribe();
      });
      storageSub1.unsubscribe();
    });
  }

  public updateEncuestaCliente(id: string, data: any) {
    return this.encuestasUsuarios.doc(id).update(data);
  }

  public crearEncuestaClienteSupervisor(encuesta: any) {
    return this.encuestasClienteSupervisorRef.add({ ...encuesta }).then((data) => {
      this.updateEncuestaClienteSupervisor(data.id, { uid: data.id });
    });
  }

  public updateEncuestaClienteSupervisor(id: string, data: any) {
    return this.encuestasClienteSupervisorRef.doc(id).update(data);
  }

  public crearEncuestaEmpleadoSupervisor(encuesta: any) {
    return this.encuestasEmpleadoSupervisorRef.add({ ...encuesta }).then((data) => {
      this.updateEncuestaEmpleadoSupervisor(data.id, { uid: data.id });
    });
  }

  public updateEncuestaEmpleadoSupervisor(id: string, data: any) {
    return this.encuestasEmpleadoSupervisorRef.doc(id).update(data);
  }

  public obtenerEncuestasClienteSupervisor() {
    return this.encuestasClienteSupervisorRef.valueChanges() as Observable<Object[]>;
  }

  public obtenerEncuestasEmpleadoSupervisor() {
    return this.encuestasEmpleadoSupervisorRef.valueChanges() as Observable<Object[]>;
  }

  ActualizarMesaEstado(mesaID:string, est:boolean){
    this.mesasRef.doc(mesaID).update({ocupada: est});
  }

  //    this.userSrv.ActualizarClienteMesa(this.pedido.uid_usuario, '' );
  ActualizarClienteMesa(USERID:string, est:string){
    this.usuariosRef.doc(USERID).update({mesa: est});
  }
}