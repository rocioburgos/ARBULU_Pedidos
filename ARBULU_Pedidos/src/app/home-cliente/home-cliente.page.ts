import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { eEstadPedido, Pedido } from '../clases/pedidos';
import { AuthService } from '../servicios/auth.service';
import { EncuestaService } from '../servicios/encuesta.service';
import { FirestoreService } from '../servicios/firestore.service';
import { PedidosService } from '../servicios/pedidos.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage implements OnInit {

  scannnedResult: any;
  content_visibility = '';
  scan_visibility = 'hidden';
  scanActive = false;

  escaneoMesa:boolean = false;
  pedido:any = "";
  encuesta:any = "";
  verEstado:boolean = false;
  propina = 0;
  propinaEscaneada = false;
  usuario:any;
  cuenta:boolean = false; 
  usuarioActual: any;

  constructor(
    private firestoreSvc: FirestoreService,
    //public pushNotificationService: PushNotificationService, 
    private router:Router,
    private utilidadesSvc: UtilidadesService,
    private authSvc: AuthService,
    private alertController: AlertController,
    private pedidos: PedidosService,
    private spinner:NgxSpinnerService,
    private encuestaSvc:EncuestaService) 
  { 
    this.usuario = this.authSvc.usuarioActual;
    if(!this.usuario)
    {
      this.usuario = localStorage.getItem('usuario_ARBULU');
    }
    this.getClientes();
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.spinner.show();
    var observable = this.pedidos.TraerPedidos().subscribe((data)=>{
      this.pedido = data.filter((item:Pedido)=>item.uid_usuario == this.authSvc.usuarioActual.uid && item.estado != eEstadPedido.FINALIZADO)[0];
      this.pedidos.pedido_uid = this.pedido.doc_id;
      var observable2 = this.firestoreSvc.getEncuestasClientes().subscribe((data)=>{
        this.encuesta = data.filter((item:any)=>item.uid_cliente == this.authSvc.usuarioActual.uid && item.uid_pedido == this.pedido.doc_id)[0];
        console.log(this.encuesta);
        this.spinner.hide();
        observable2.unsubscribe();
      })
      this.spinner.hide();
      observable.unsubscribe();
    })

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
              this.authSvc.signOut().then(()=>{ 
                setTimeout(() => {
                 
                  this.spinner.hide();
                  this.router.navigate(['login']); 
                }, 3000);
              });
           

          },
        },
      ],
    });  
    await alert.present(); 


  }
  
  async checkPermission() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  async startScan() {
     
    try {
      const permission = await this.checkPermission();
      if (!permission) {
        return;
      }
      this.scanActive = true;
      await BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      this.content_visibility = 'hidden';
      this.scan_visibility = '';
      const result = await BarcodeScanner.startScan();
      console.log(result);
      this.content_visibility = '';
      this.scan_visibility = 'hidden';
      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');
      if (result?.hasContent) {
        console.log(result);
        if(result.content === this.usuario.mesa){
          alert(this.usuario.id);
          //this.firestoreSvc.update(this.usuario.id, {enListaDeEspera: true});
          this.escaneoMesa = true;
          this.utilidadesSvc.successToast("Escaneo de mesa correcto", 2000);
          alert(result.content);
        }
        else{
          this.stopScan();
          this.utilidadesSvc.errorToast("Mesa Incorrecta", 2000);
        }

        this.scanActive = false;
      }
    } catch (error) {
      console.log(error);
      this.stopScan();
      this.utilidadesSvc.errorToast("Error al escanear", 3000);
    } 
  }
 
  RealizarPedido(){
    this.router.navigateByUrl('carta-productos')
  }

  stopScan() {
    setTimeout(() => {
      //this.spinner.hide();
    }, 3000);
    this.content_visibility = '';
    this.scan_visibility = 'hidden';
    this.scanActive = false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
  }

  getClientes() {
    
    this.firestoreSvc.obtenerUsuario().subscribe((data: any) => {
      for (let item of data) {
        if (item.uid === this.usuario.uid) {
          this.usuarioActual = item;
          break;
        }
      }
    });
  }



}
