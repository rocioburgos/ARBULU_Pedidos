import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import {  eEstadoProductoPedido, eEstadPedido, Pedido } from '../clases/pedidos';
import { Productos } from '../clases/productos';
import { PedidosService } from '../servicios/pedidos.service';
import { ProductosService } from '../servicios/productos.service';
import { UtilidadesService } from '../servicios/utilidades.service';

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
  tieneProductos:boolean= false;

  constructor(private productSrv:ProductosService,
     private pedidoSrv:PedidosService,
     private utilSrv:UtilidadesService,
     private router:Router) { 
    this.showModal = false;
  }

  ngOnInit() {
    this.productSrv.TraerProductos().subscribe( data => {
      console.log(data)
      this.productos = data;
      this.productos.forEach( x => { 
        x.cantidad = 0;  
        x.estadoProductoPedido= eEstadoProductoPedido.PENDIENTE;
        x.selected = false; 
        console.log(x);
      })
    });
  }

  async presentAlertConfirm(item:Productos) {
    this.productoSeleccionado= item;
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
  }
 

  abrirChat(){
    
  }
  
  tieneProductosSeleccionados() {
    let prodSelected = 0;
    this.productos.forEach(x =>{
      prodSelected += (x.selected ? 1 : 0);
    })
    if(prodSelected > 0){
      //guardar el pedido
      this.tieneProductos= true;
    } else{
      this.tieneProductos= false;
    }
  }

  sumar(index:number){
    this.productos[index].selected = true;
    this.productos[index].cantidad++;
    this.total += this.productos[index].precio;
    this.CalcularDemora();
    this.tieneProductosSeleccionados();
    
  }
  restar( index:number){
     if(this.productos[index].cantidad > 0){
       this.productos[index].cantidad--;
       if(this.productos[index].cantidad == 0){
        this.productos[index].selected = false;
       }
       this.total -= this.productos[index].precio;
       this.CalcularDemora();
     }
     this.tieneProductosSeleccionados();
  }

  
  CalcularDemora(){
    let prodSelected = 0;
    this.productos.forEach(x =>{
      prodSelected += (x.selected ? 1 : 0);
    })
    this.demoraEstimada = prodSelected > 0 ? Math.max.apply(Math, this.productos.map( x => { return (x.selected ? x.tiempo_elaboracion : null)})) : 0
  }

  hacerPedido(){ 
    let productosParaPedir= this.productos.filter( x=> { return x.selected == true});
    let nuevoPedido:Pedido= new Pedido();
    if(this.tieneProductos== true ){
      nuevoPedido.estado= eEstadPedido.PENDIENTE;
      nuevoPedido.numero_mesa= 255;
      nuevoPedido.productos= productosParaPedir;
      nuevoPedido.tiempo_elaboracion= this.demoraEstimada;
      nuevoPedido.total= this.total;
      nuevoPedido.uid_mesa='nose'

      this.pedidoSrv.GuardarNuevoPedido(nuevoPedido).then((res)=>{
        console.log('RESPUESTA: '+res)
        this.utilSrv.successToast('Pedido realizado con exito',4500);
        setTimeout(() => {
          this.router.navigateByUrl('/home')
        }, 5000);
      });
      
    }else{
      console.log('no tiene ningun producto seleccionado')
    }
  }

  CalcularTotal(){
    this.total = 0;
    this.productos.forEach(x =>{
      this.total +=  x.selected ? x.precio * x.cantidad : 0
    })
  }
  
}