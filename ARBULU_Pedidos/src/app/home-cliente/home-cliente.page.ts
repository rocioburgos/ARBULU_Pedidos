import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { eEstadPedido, Pedido } from '../clases/pedidos';
import { AuthService } from '../servicios/auth.service';
import { EncuestaService } from '../servicios/encuesta.service';
import { FirestoreService } from '../servicios/firestore.service';
import { NotificationService } from '../servicios/notification.service';
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

  escaneoMesa: boolean = false;//PONER EL FALSE
  yaEscaneo=false;
  pedido: any = "";
  encuesta: any = "";
  verEstado: boolean = false;
  propina = 0;
  propinaEscaneada = false;
  usuario: any;
  cuenta: boolean = false;
  usuarioLS: any = null;
  tienePedidosEnCurso = false;
  tieneMesa = false;
  pedidoEnCurso: any;
  usuarioActual: any;
  usuarioToken:any;
  constructor(
    private firestoreSvc: FirestoreService,
    //public pushNotificationService: PushNotificationService, 
    private router: Router,
    private utilidadesSvc: UtilidadesService,
    private authSvc: AuthService,
    private alertController: AlertController,
    private spinner: NgxSpinnerService,
    private pedidoSrv: PedidosService,
    private notiSrv:NotificationService,
    public encuestasSrv:EncuestaService) {

  }

  ngOnInit() {
    this.usuarioToken = JSON.parse(localStorage.getItem('usuario_ARBULU'));  
    this.notiSrv.inicializar();
    this.usuario = this.authSvc.usuarioActual;
    
    if (!this.usuario) {
      this.usuario = JSON.parse(localStorage.getItem('usuario_ARBULU'));
      console.log(this.usuario);
    }
    this.spinner.show();
    this.firestoreSvc.obtenerColeccionUsuario().subscribe(data => {
      var usuarios = data;
      //console.log(usuarios);

      usuarios.forEach(element => {
        //console.log(element.uid + " " + " " + this.usuario.uid);

        if (element.uid == this.usuario.uid) {
          this.usuario = element;
          if(this.usuario.mesa != '' && !this.usuario.enListaDeEspera){
            this.escaneoMesa = true;
          }
            console.log(this.usuario.mesa);
          
          //alert(this.usuario);
          console.log(this.usuario);
          this.pedido = this.pedidoSrv.TraerPedidos().subscribe( resp => {
            this.pedido = resp;
            this.pedido.forEach(element => {
              if(element.uid_usuario == this.usuario.uid){
                
                if(element.estado != 'FINALIZADO'){
                  this.pedidoEnCurso = element;
                  this.tienePedidosEnCurso = true;
                  console.log("tiene pedido");
                  this.escaneoMesa = true;
                }
              }
              else{
                
                console.log("NO tiene pedido");
                
              }
            });
            // alert(resp);
            // if (resp == 0) {
            //   alert(this.tienePedidosEnCurso);
            //   this.tienePedidosEnCurso = false;
            // } else {
            //   this.tienePedidosEnCurso = true;
            //   this.pedidoEnCurso = resp[0];
            //   alert(this.pedidoEnCurso);
            // }
            console.log(this.tienePedidosEnCurso);
            //alert(this.pedido);
            console.log(this.pedidoEnCurso);
            if(this.tienePedidosEnCurso){
              this.pedidoSrv.pedido_uid = this.pedidoEnCurso.doc_id;
              console.log(this.pedidoEnCurso);
              var observable = this.firestoreSvc.getEncuestasClientes().subscribe((data) => {
                this.encuesta = data.filter((item: any) => item.uid_cliente == this.usuario.uid && item.uid_pedido == this.pedidoEnCurso.doc_id)[0];     
                console.log("Encuesta:" + this.encuesta);        
                 
              });
            }
          });
          this.spinner.hide();

          // this.pedidoSrv.TraerPedidoByUserId(this.usuario.uid).subscribe((res) => {
          //   console.log(res);
          //   alert(res);
          //   if (res == 0) {
          //     alert(this.tienePedidosEnCurso);
          //     this.tienePedidosEnCurso = false;
          //   } else {
          //     this.tienePedidosEnCurso = true;
          //     this.pedidoEnCurso = res[0];
          //     alert(this.pedidoEnCurso);
          //   }
          //   console.log(this.usuario);
          //   alert(this.pedido);
          //   this.pedidoSrv.pedido_uid = this.pedidoEnCurso.doc_id;
          //   console.log(this.pedidoEnCurso);
          //   var observable = this.firestoreSvc.getEncuestasClientes().subscribe((data) => {
          //     this.encuesta = data.filter((item: any) => item.uid_cliente == this.authSvc.usuarioActual.uid && item.uid_pedido == this.pedido.doc_id)[0];
          //     this.spinner.hide();
          //     observable.unsubscribe();
          //   })
          // });
        }
      });
    });
   
    

    //this.usuarioLS = this.authSvc.getCurrentUserLS();
    // this.firestoreSvc.obtenerUsuarioPorId(this.usuarioActual.uid).then((resp: any) => {
    //   this.usuarioActual = resp;
    //   console.log(this.usuarioActual);
    // });
    
    // this.pedidoSrv.TraerPedidoByUserId(this.usuarioActual.uid).subscribe((res) => {
    //   if (res == 0) {
    //     this.tienePedidosEnCurso = false;
    //   } else {
    //     this.tienePedidosEnCurso = true;
    //     this.pedidoEnCurso = res[0];
    //     this.pedidoSrv.pedido_uid = this.pedidoEnCurso.doc_id;
    //   }
    // });

    // var observable = this.firestoreSvc.getEncuestasClientes().subscribe((data) => {
    //   this.encuesta = data.filter((item: any) => item.uid_cliente == this.usuarioActual.uid && item.uid_pedido == this.pedidoEnCurso.doc_id);

    //   observable.unsubscribe();
    // });


  }

  async cerrarSesion() {

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
            this.utilidadesSvc.warningToast("Cerrando sesion.", 2000);
            // localStorage.removeItem('usuario_ARBULU');
            // this.usuarioActual.token='';
            // this.firestoreSvc.update(this.usuarioLS.uid,{token:''});
            this.firestoreSvc.actualizarToken( '', this.usuarioToken.uid).finally(()=>{
              this.authSvc.signOut().then(() => {
                setTimeout(() => {
                  this.spinner.hide();
                  this.router.navigate(['login']);
                }, 7000);
              });
            })

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
        if (result.content === this.usuario.mesa) {
          //alert(this.usuario.id);
          this.firestoreSvc.update(this.usuario.id, { enListaDeEspera: false });
          this.escaneoMesa = true;
          this.yaEscaneo=true;
          this.utilidadesSvc.successToast("Escaneo de mesa correcto", 2000);
          //alert(result.content);
        }
        else {
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

  RealizarPedido() {
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
          this.usuario = item;
          break;
        }
      }
    });
  }
 

  navegar(link:string){
    setTimeout(() => {
       this.router.navigate([link]) 
    }, 1000);
  }

}