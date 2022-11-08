import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { eEstadPedido } from '../clases/pedidos';
import { AuthService } from '../servicios/auth.service';
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
    private authSrv:AuthService) { }

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


}
