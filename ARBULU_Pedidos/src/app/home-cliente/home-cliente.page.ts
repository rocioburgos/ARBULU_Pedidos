import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
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
  verEstado:boolean = false;
  propina = 0;
  propinaEscaneada = false;
  usuario:any;
  cuenta:boolean = false;
  spinner:boolean = false;

  constructor(
    private firestoreSvc: FirestoreService,
    //public pushNotificationService: PushNotificationService, 
    private router:Router,
    private utilidadesSvc: UtilidadesService,
    private authSvc: AuthService) 
  { 
    this.usuario = this.authSvc.usuarioActual;
    if(!this.usuario)
    {
      this.usuario = localStorage.getItem('usuario_ARBULU');
    }
    console.log(this.usuario);
  }

  ngOnInit() {
  }

  cerrarSesion(){
    this.authSvc.signOut().then(()=>{
      this.utilidadesSvc.warningToast("Cerrando sesion.",2000);
      setTimeout(() => {
        this.router.navigate(['login']); 
      }, 2500);
    });
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

}
