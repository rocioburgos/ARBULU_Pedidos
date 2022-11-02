import { AbstractType, Component, OnInit } from '@angular/core';
import { UtilidadesService } from '../servicios/utilidades.service';
import { FirestoreService } from '../servicios/firestore.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-qr-ingreso-local',
  templateUrl: './qr-ingreso-local.page.html',
  styleUrls: ['./qr-ingreso-local.page.scss'],
})
export class QrIngresoLocalPage implements OnInit {

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
    private authSvc: AuthService) 
  { 
    this.usuarioActual = this.authSvc.usuarioActual;
    console.log(this.usuarioActual);
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
      alert(result.content + result?.hasContent);
      if (result?.hasContent) {
        if(result.content === 'qrIngresoAListaDeEspera'){
          this.firestoreSvc.update(this.usuarioActual.id, {enListaDeEspera: true});
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


}
