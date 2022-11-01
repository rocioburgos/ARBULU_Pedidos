import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Productos } from '../clases/productos';
import { ProductosService } from '../servicios/productos.service';

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.page.html',
  styleUrls: ['./listado-productos.page.scss'] 
})
export class ListadoProductosPage implements OnInit {

  productos:any;
  showModal: boolean = false;
  productoSeleccionado:Productos;
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
}
