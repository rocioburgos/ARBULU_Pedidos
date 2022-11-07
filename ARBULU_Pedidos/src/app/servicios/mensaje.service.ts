import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Mensaje } from '../clases/mensaje'; 
@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private mensajesCollection:AngularFirestoreCollection<Mensaje>;
  items:Observable<Mensaje[]>; 
   
  constructor(private afs: AngularFirestore) {  
    this.mensajesCollection = afs.collection<Mensaje>('mensajes');
    this.items = this.mensajesCollection.valueChanges( );
  }

  nuevoMensaje(mensaje:Mensaje){   
   return this.mensajesCollection.add(Object.assign({},mensaje));
  }

  traerMensajes(){ 
    this.mensajesCollection =  this.afs.collection('mensajes', 
                                      ref => ref.orderBy('fulldate',  "asc")       
                                    );  
      return this.mensajesCollection.valueChanges(); 
  }
}
