import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  
import { Photo } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ImagenesService } from '../servicios/imagenes.service';
@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
})
export class AltaEmpleadoPage implements OnInit {

  email: string;
  clave: string;
  show_error: boolean = false; //
  descripcion_error: string = '';
  public altaForm: FormGroup; 
  habilitar:boolean;
  path:string='';

  scannnedResult: any;
  content_visibility = '';
  scan_visibility = 'hidden';
  scanActive = false;
  dniData:any;
  nombre='';
  apellido='';
  dni='';
  constructor(
    private fromBuilder: FormBuilder,
    private router: Router ,
    private imagenSrv:ImagenesService
  ) {
    this.email = '';
    this.clave = '';
  }

  ngOnInit() {

    this.altaForm = this.fromBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      apellido: ['', Validators.compose([Validators.required])],
      dni: ['', Validators.compose([Validators.required, Validators.min(10000000), Validators.max(99999999)])],
      cuil: ['', Validators.compose([Validators.required, Validators.min(10000000000), Validators.max(99999999999)])],
      //foto
      perfil: ['', Validators.compose([Validators.required])]
    });
  }


  aceptar() {   
  /*  let imagenesDoc = {
      'usuario': this.authSrv.getCurrentUserLS_email(),
      imagenes: this.paths, 
      fullDate: this.horario(),
      tipo: tipo.tipo,
      usuarios_like:[],
      cantidad_likes: 0
    };
    this.imagenSrv.saveDoc(imagenesDoc).then((data) => {

      tipo.tipo == 'linda' ? this.router.navigate(['cosaslindas']) : this.router.navigate(['cosasfeas']);
    
    }).catch(err => {
      this.spinner.hide()
      this.mostrarError = true;
      console.log(err)
    }).finally(()=>{
      this.spinner.hide()
    });*/
  }


  tomarFoto() {
    this.addPhotoToGallery();
  }

  async addPhotoToGallery() {
    const photo = await this.imagenSrv.addNewToGallery();
    this.uploadPhoto(photo).then(() => {
       
      setTimeout(() => {
        this.habilitar = true; 
      }, 5000);

    }
    ).catch((err) => { 
      console.log("Error addPhotoToGallery", err);
    })
  }

  private async uploadPhoto(cameraPhoto: Photo) {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    const filePath = this.getFilePath();

    const uploadTask = this.imagenSrv.saveFile(blob, filePath);

   /* uploadTask.then(async res => {
      const downloadURL = await res.ref.getDownloadURL();
      if (downloadURL.length > 0) {
        this.path = downloadURL;
 
      } else {
        console.log("IMAGEN NO CORRECTA  ");
      }
    })
      .catch((err) => {
        console.log("Error al subbir la imagen: ", err);
      });*/
  }

  getFilePath() {
    return new Date().getTime() + '-test';
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
      document.querySelector('body').classList.add('scanner-active');
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

      this.content_visibility = '';
      this.scan_visibility = 'hidden';
      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');

      if (result?.hasContent) { 
        this.dniData = result.content.split('@'); 
        this.nombre= this.dniData[2];
        this.apellido= this.dniData[1];
        this.dni= this.dniData[4];
        document.querySelector('body').classList.remove('scanner-active');
        this.scanActive = false; 
      }
    } catch (error) {
      console.log(error);
      document.querySelector('body').classList.remove('scanner-active');
      this.stopScan();
    } 
  }

 

  stopScan() {
    setTimeout(() => { 
    }, 3000);
    this.content_visibility = '';
    this.scan_visibility = 'hidden';
    this.scanActive = false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
  }

  ngAfterViewInit(): void {
    BarcodeScanner.prepare();
  }

}
