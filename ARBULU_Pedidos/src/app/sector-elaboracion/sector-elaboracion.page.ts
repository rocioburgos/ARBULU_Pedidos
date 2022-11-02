import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pedido } from '../clases/pedidos';
import { PedidosService } from '../servicios/pedidos.service';
import { ProductosService } from '../servicios/productos.service';

@Component({
  selector: 'app-sector-elaboracion',
  templateUrl: './sector-elaboracion.page.html',
  styleUrls: ['./sector-elaboracion.page.scss'],
})
export class SectorElaboracionPage implements OnInit {
  
  tipoSector:string='BEBIDA'; //Hacerlo funcional con la sesion 
  pedidos:any[]=[];
  constructor(private router:Router,
    private pedidosSrv:PedidosService,
    private prodSrv:ProductosService) { }

  ngOnInit() {
    this.pedidosSrv.TraerPedidos().subscribe((res)=>{
      this.pedidos= res;
    });
  }

  verDetalle(pedido_id:any){
    
    this.router.navigate(['/detalle-pedido/', { pedido_id: pedido_id }]);
  }

}
