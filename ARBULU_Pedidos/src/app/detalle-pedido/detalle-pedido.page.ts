import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { eEstadoProductoPedido, eEstadPedido, productoPedido } from '../clases/pedidos';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
import { PedidosService } from '../servicios/pedidos.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
})
export class DetallePedidoPage implements OnInit {

  pedido_id: string = '';
  pedido: any={
    numero_mesa:0
  };
 
    sectorUserActual='';//
    usuario:any;
    esCliente=false;
    esMetre=false;
    esEmpleado=false;
    pedidoLS:any;
  constructor(
    private route: ActivatedRoute,
    private pedidoSrv: PedidosService,
    private authSrv:AuthService,
    private userSrv:FirestoreService) {
    // this.route.snapshot.paramMap.get('doc_id')
    this.pedido_id = this.route.snapshot.paramMap.get('pedido_id');

      
  }

  ngOnInit() {
    this.usuario=this.authSrv.getCurrentUserLS();
    if(this.usuario.tipo =='cliente'){
      this.esCliente=true;
    }else if(this.usuario.tipo =='empleado'){
      
      if(this.usuario.tipoEmpleado=='bartender'){
        this.esEmpleado= true;
        this.sectorUserActual='BEBIDA';
      }else if(this.usuario.tipoEmpleado=='cocinero'){
        this.esEmpleado= true;
        this.sectorUserActual='COCINA';
      }else{
        this.esMetre= true;
      }
    }

    if(this.esCliente){ 
     this.pedidoLS= localStorage.getItem('pedido')
      if(this.pedidoLS != null  ){
        this.pedidoLS= JSON.parse(this.pedidoLS); 
        this.pedido =this.pedidoLS;
        this.pedidoSrv.TraerPedido(this.pedido.pedidoID).subscribe((res) => {
          this.pedido = res;
          console.log('PEDIDO SELECCIONADO: ' + this.pedido.numero_mesa)
        });
        } 
    }else{
      this.pedidoSrv.TraerPedido(this.pedido_id).subscribe((res) => {
        this.pedido = res;
        console.log('PEDIDO SELECCIONADO: ' + this.pedido.numero_mesa)
      });

    }
  

  }

  cambiarEstado(item:any,proxEstado:string) {
    let   cantProdPedido= this.pedido.productos.length;
    alert('len '+cantProdPedido)
    let productosTerminados=0;
    if(this.pedido.estado=='CONFIRMADO'){
      this.pedido.estado= eEstadPedido.EN_ELABORACION;
    }
 
    item.estadoProductoPedido= (proxEstado==eEstadoProductoPedido.EN_ELABORACION )? eEstadoProductoPedido.EN_ELABORACION : eEstadoProductoPedido.TERMINADO;
    this.pedido.productos.forEach(prod => {
      if(prod.doc_id== item.doc_id){
        prod= item
      }
    });

    this.pedido.productos.forEach((producto:productoPedido) => {
       if(producto.estadoProductoPedido == eEstadoProductoPedido.TERMINADO){
        productosTerminados++;
       
       }  
    });

    if(productosTerminados == cantProdPedido){
      this.pedido.estado= eEstadPedido.TERMINADO;
      console.log('PRODUCTO TERMINADO');
    } 
    console.log( 'ESTADO  GENERAL DESPUES DE CADA SECTOR:'+ this.pedido.estado)
    this.pedidoSrv.actualizarProductoPedido(this.pedido, this.pedido.doc_id)
  } 

  confirmarRecepcion(pedidoID:string){
    console.log('Pedido recibido: '+pedidoID)
    this.pedido.estado= eEstadPedido.RECIBIDO; 
    this.pedidoSrv.actualizarProductoPedido(this.pedido, pedidoID);
  }
}
