import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
/*import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';*/
import { Observable } from 'rxjs';
import { Productos } from 'src/app/clases/productos';

import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  items: Observable<any[]>; 
  public dbRef: AngularFirestoreCollection<any>;
  
  constructor(
    public afStore: AngularFirestore 
  ) {
    this.dbRef = this.afStore.collection("pedidos");
  }
 
  GuardarNuevoPedido(nuevoPedido: any): any{
    return this.dbRef.add(Object.assign({},nuevoPedido));
  }

  GuardarNuevoPedidoWithId(item: any, id:string) {
    
    this.dbRef = this.afStore.collection('pedidos');
    return this.dbRef.doc(id).set(Object.assign({}, item));    
  }


  TraerPedidos(): Observable<any>{
    return this.dbRef.valueChanges({idField: "doc_id"});
  }
  
  TraerPedido(doc_id): Observable<any>{
    return this.afStore.doc(`pedidos/${doc_id}`).valueChanges({idField: "doc_id"});
  }

  async actualizarProductoPedido(pedido:any, id_doc:string){
  /*  this.afStore.doc(`pedidos/${id_doc}`).update({
      productos: pedido.productos,
      estado: pedido.estado,
      numero_mesa: pedido.numero_mesa,
      tiempo_elaboracion: pedido.tiempo_elaboracion,
      total: pedido.total,
      uid_mesa: pedido.uid_mesa
    }); */
    this.afStore.doc(`pedidos/${id_doc}`).update(pedido)
  } 

   
  
}
