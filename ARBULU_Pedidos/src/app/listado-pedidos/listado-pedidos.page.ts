import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { eEstadPedido } from '../clases/pedidos';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
import { MensajeService } from '../servicios/mensaje.service';
import { PedidosService } from '../servicios/pedidos.service';

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.page.html',
  styleUrls: ['./listado-pedidos.page.scss'],
})
export class ListadoPedidosPage implements OnInit {

  tipoSector:string='COCINA'; //Hacerlo funcional con la sesion 
  pedidos:any[]=[];
  prodPendientesElaboracion:number=0;
  esMetre= false;
  esCliente=false;
  esEmpleado=false;
  usuario:any;
  constructor(private router:Router,
    private pedidosSrv:PedidosService ,
    private authSrv:AuthService,
    private msjSrv:MensajeService,
    private fireSrv:FirestoreService,
    private spinnerSrv:NgxSpinnerService) { }

  ngOnInit() {
    this.pedidosSrv.TraerPedidos().subscribe((res)=>{
      this.pedidos= res;
    });

    this.usuario=this.authSrv.getCurrentUserLS();
    if(this.usuario.tipo =='cliente'){
      this.esCliente=true;
    }else if(this.usuario.tipo =='empleado'){
      
      if(this.usuario.tipoEmpleado=='bartender' || this.usuario.tipoEmpleado=='cocinero'){
        this.esEmpleado= true; 
        
      }else{
        this.esMetre= true;
      }
    }
  }

  verDetalle(pedido_id:any){ 
    this.router.navigate(['/detalle-pedido/', { pedido_id: pedido_id }]);
  }

  cambiarEstado(pedido_sel:any,proxEstado:string) { 
    this.pedidos.forEach(pedido => {
     if(pedido.doc_id==pedido_sel.doc_id ){
      pedido.estado= (proxEstado==eEstadPedido.CONFIRMADO )? eEstadPedido.CONFIRMADO : eEstadPedido.ENTREGADO;
    
      this.pedidosSrv.actualizarProductoPedido( pedido, pedido.doc_id)
     }
    }); 
  } 
  //solo el mozo
 /* finalizarPedido(pedido_sel:any,proxEstado:string){
     
       pedido_sel.estado= eEstadPedido.FINALIZADO; 
      this.pedidosSrv.actualizarProductoPedido(pedido_sel, pedido_sel.doc_id);
      //Eliminar mensajes
      this.msjSrv.borrarMensajesByMesa(pedido_sel.numero_mesa);
      //Liberar mesa y cliente
       setTimeout(() => { 
       }, 3000);
    }
*/


    confirmarPago(pedidoID:string){
      let pedido;
      this.pedidosSrv.TraerPedido(pedidoID).subscribe((res) => {
         pedido = res;
        console.log('PEDIDO SELECCIONADO: ' +  pedido)
      });
       pedido.estado= eEstadPedido.COBRADO; 
      this.pedidosSrv.actualizarProductoPedido( pedido, pedidoID).then((res)=>{
        this.liberarMesa(pedidoID);
      });
    }
  
    liberarMesa(pedidoID:string){
      this.spinnerSrv.show();
      let pedido;
      this.pedidosSrv.TraerPedido(pedidoID).subscribe((res) => {
         pedido = res;
        console.log('PEDIDO SELECCIONADO: ' +  pedido)
         //finalizar pedido 
        pedido.estado= eEstadPedido.FINALIZADO; 
        this.pedidosSrv.actualizarProductoPedido(pedido, pedidoID);
        //Borrar mensajes
        this.msjSrv.borrarMensajesByMesa( pedido.numero_mesa);
        //Liberar mesa
        this.fireSrv.ActualizarMesaEstado( pedido.uid_mesa, false );
        //liberar usuario
    
        this.fireSrv.ActualizarClienteMesa( pedido.uid_usuario, '' );
    
      });

      setTimeout(() => {
        this.spinnerSrv.hide();
      }, 6000);
    }
}
