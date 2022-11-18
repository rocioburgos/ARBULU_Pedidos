import { AbstractType, Component, OnInit } from '@angular/core';
import { UtilidadesService } from '../servicios/utilidades.service';
import { FirestoreService } from '../servicios/firestore.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AuthService } from '../servicios/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../servicios/notification.service';
import { eEmpleado } from '../clases/usuario';

@Component({
  selector: 'app-qr-ingreso-local',
  templateUrl: './qr-ingreso-local.page.html',
  styleUrls: ['./qr-ingreso-local.page.scss'],
})
export class QrIngresoLocalPage implements OnInit {

  usuarios: any;
  usuarioActual: any;
  scannnedResult: any;
  content_visibility = '';
  scan_visibility = 'hidden';
  scanActive = false;

  constructor(
    private firestoreSvc: FirestoreService,
    //public pushNotificationService: PushNotificationService, 
    private router: Router,
    private utilidadesSvc: UtilidadesService,
    private authSvc: AuthService,
    private spinner: NgxSpinnerService,
    private pushSrv:NotificationService) 
  { 

    this.spinner.show();
    
    this.usuarioActual = this.authSvc.usuarioActual;
    // var auxUsuario = JSON.parse(localStorage.getItem('usuario_ARBULU'));
    // this.usuarioActual = this.firestoreSvc.getUsuarioActualByID(auxUsuario.uid);

    if(this.usuarioActual){
      //alert("usuario" +this.usuarioActual);
      console.log("usuario actual:"+this.usuarioActual);
      setTimeout(() => {
                    this.spinner.hide();
                    if((this.usuarioActual.enListaDeEspera && this.usuarioActual.mesa== '')
                    || (!this.usuarioActual.enListaDeEspera && this.usuarioActual.mesa!= '')){
                      //tiene que esperar que se le asigne la mesa
                      //ya tiene una mesa
                      this.router.navigate(['home-cliente']);
                    }
                  }, 1000);
    }
    else{
      setTimeout(() => {
        this.spinner.hide();
        //alert("anoniomo"  + this.usuarioActual);
        this.usuarioActual = JSON.parse(localStorage.getItem('usuario_ARBULU'));
      }, 1000);
      
    }

  }

 
  ngOnInit(): void {
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
      //alert(result.content + result?.hasContent);
      if (result?.hasContent) {
        if(result.content === 'qrIngresoAListaDeEspera'){
          this.firestoreSvc.update(this.usuarioActual.uid, {enListaDeEspera: true});

          //mandar push notification
          this.notificar();

          this.router.navigate(['/home-cliente']);
          this.utilidadesSvc.successToast("En lista de espera...", 2000);
        }
        else{
          this.stopScan();
          this.router.navigate(['/qr-ingreso-local']);
          this.utilidadesSvc.errorToast("Escaneo de QR Incorrecto", 2000);
        }

        this.scanActive = false;
      }
    } catch (error) {
      console.log(error);
      this.stopScan();
      this.utilidadesSvc.errorToast("Error al escanear", 2000);
    } 
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



  

  // probarNotification(){
  //   let idUser = JSON.parse(this.userService.getuserIdLocal());
  //   this.pushNotificationService.EnviarNotificationAUnUsuario(idUser,"PRUEBA PRUEBA","PROBANDO PROBANDO");
  // }

  notificar(){
    this.usuarios.forEach(user => {
      if(user.token!='' && user.tipo=='empleado' && user.tipoEmpleado=='metre' || user.tipoEmpleado=='mozo'){
      this.pushSrv 
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        registration_ids: [
          // eslint-disable-next-line max-len
          user.token 
        ],
        notification: {
          title: 'Nuevo cliente en lista de espera',
          body: 'Hay un cliente que ingreso al local',
        },
        data: {
          ruta: 'home-metre', 
        },
      })
      .subscribe((data) => {
        console.log(data);
      });}
    });
  }

}
