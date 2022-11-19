import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
import { NotificationService } from '../servicios/notification.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-home-metre',
  templateUrl: './home-metre.page.html',
  styleUrls: ['./home-metre.page.scss'],
})
export class HomeMetrePage implements OnInit {
 
  listadoClientesEnEspera: Array<any> = [];
  mesas: Array<any> = [];
  usuarioActual:any;
  constructor(private authSrv:AuthService,
    private utilidadesSvc:UtilidadesService,
    private router:Router,
    private firesoteSvc: FirestoreService,
    private spinner:NgxSpinnerService,
    private alertController:AlertController,
    private notiSrv:NotificationService
    ) {
      this.getClientes();
      this.getMesas();
    }
  
  ngOnInit() {
    this.notiSrv.inicializar();
    this.usuarioActual = JSON.parse(localStorage.getItem('usuario_ARBULU'));  
  }
  
  async cerrarSesion(){

    const alert = await this.alertController.create({
      header: '¿Seguro que quiere cerrar sesión?',
      cssClass: 'alertSesion',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'

        },
        {
          text: 'Si',
          role: 'confirm',
          handler: () => {
          
            this.spinner.show(); 
            this.utilidadesSvc.warningToast("Cerrando sesion.",2000);
            this.firesoteSvc.actualizarToken('',this.usuarioActual.uid).finally(()=>{
              this.authSrv.signOut().then(()=>{ 
                setTimeout(() => { 
                  this.spinner.hide();
                  this.router.navigate(['login']); 
                }, 3000);
              });
            }) 
          },
        },
      ],
    });  
    await alert.present(); 


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


  navegar(link:string){
    setTimeout(() => {
       this.router.navigate([link]) 
    }, 3000);
  }

}
