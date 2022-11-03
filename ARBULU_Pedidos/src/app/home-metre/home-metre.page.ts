import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-home-metre',
  templateUrl: './home-metre.page.html',
  styleUrls: ['./home-metre.page.scss'],
})
export class HomeMetrePage implements OnInit {
 
  listadoClientesEnEspera: Array<any> = [];
  mesas: Array<any> = [];

  constructor(private authSrv:AuthService,
    private utilidadesSvc:UtilidadesService,
    private router:Router,
    private firesoteSvc: FirestoreService) {
      this.getClientes();
      this.getMesas();
    }
  
  ngOnInit() {
  }
  
  cerrarSesion(){
    this.authSrv.signOut().then(()=>{
      this.utilidadesSvc.warningToast("Cerrando sesion.",2000);
      setTimeout(() => {
        this.router.navigate(['login']); 
      }, 2500);
    });
  }

  getMesas() {
    
    let subMesas = this.firesoteSvc.obtenerMesas().subscribe((data: any) => {
      this.mesas = [];
      for (let item of data) {
        if (!item.ocupada) {
          this.mesas.push(item);
        }
      }
      console.log(this.mesas);
      //subMesas.unsubscribe();
    });
  }

  getClientes() {
    
    let clientesSub = this.firesoteSvc.obtenerUsuario().subscribe((data: any) => {
      this.listadoClientesEnEspera = [];
      for (let item of data) {
        if (item.enListaDeEspera) {
          this.listadoClientesEnEspera.push(item);
        }
      }
      console.log(this.listadoClientesEnEspera);
      
      //clientesSub.unsubscribe();
    });
  }

  asignarMesa(cliente: any, mesa: any){
    console.log(cliente.uid + " cliente ");
    console.log(mesa.uid + " mesa");
    cliente.enListaDeEspera = false;
    cliente.mesa = mesa.numero.toString();//podria no setearlo
    mesa.ocupada = true;
    // this.userS.EditarColeccion(cliente.id, cliente, "clientes");
    // this.userS.EditarColeccion(mesa.id, mesa, "mesas");

    this.firesoteSvc.update(cliente.uid, cliente);
    this.firesoteSvc.updateMesa(mesa.uid, mesa);

    this.getClientes();
    this.getMesas();
  }

}
