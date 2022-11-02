import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { eEstadoProductoPedido, eEstadPedido, productoPedido } from '../clases/pedidos';
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
//sectorUserActual='COCINA'; 
    sectorUserActual='BEBIDA';//
  constructor(
    private route: ActivatedRoute,
    private pedidoSrv: PedidosService) {
    // this.route.snapshot.paramMap.get('doc_id')
    this.pedido_id = this.route.snapshot.paramMap.get('pedido_id');

    
  }

  ngOnInit() {
    this.pedidoSrv.TraerPedido(this.pedido_id).subscribe((res) => {
      this.pedido = res;
      console.log('PEDIDO SELECCIONADO: ' + this.pedido.numero_mesa)
    })
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
        alert('uno mas')
       } 
       alert('EEAAA mas '+producto.estadoProductoPedido)
    });

    if(productosTerminados == cantProdPedido){
      this.pedido.estado= eEstadPedido.TERMINADO;
      console.log('PRODUCTO TERMINADO');
    }
    alert('termi '+ productosTerminados)
    console.log( 'ESTADO  GENERAL DESPUES DE CADA SECTOR:'+ this.pedido.estado)
    this.pedidoSrv.actualizarProductoPedido(this.pedido, this.pedido.doc_id)
  } 
}
