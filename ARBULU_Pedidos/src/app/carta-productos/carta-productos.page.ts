import { Component, OnInit } from '@angular/core';
import { Productos } from '../clases/productos';
import { ProductosService } from '../servicios/productos.service';

@Component({
  selector: 'app-carta-productos',
  templateUrl: './carta-productos.page.html',
  styleUrls: ['./carta-productos.page.scss'],
})
export class CartaProductosPage implements OnInit {

  productos:any;
  showModal: boolean = false;
  productoSeleccionado:Productos;
  total:number=0;
  demoraEstimada:number=0;
  
  constructor(private productSrv:ProductosService) { 
    this.showModal = false;
  }

  ngOnInit() {
    this.productSrv.TraerProductos().subscribe((res)=>{
      this.productos= res;
    })
  }

  async presentAlertConfirm(item:Productos) {
    this.productoSeleccionado= item;
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
  }

  hacerPedido(){

  }

  abrirChat(){
    
  }

}
