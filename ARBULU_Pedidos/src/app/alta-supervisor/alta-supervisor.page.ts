import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../servicios/firestore.service';
import { ImagenesService } from '../servicios/imagenes.service';
import { UtilidadesService } from '../servicios/utilidades.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Photo } from '@capacitor/camera';

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
})
export class AltaSupervisorPage implements OnInit {
  email: string;
  clave: string;
  show_error: boolean = false; //
  descripcion_error: string = '';
  altaForm: FormGroup; 
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
  cuil='';

  constructor(private router:Router, 
    private firestore:FirestoreService, 
    private utilidadesSrv:UtilidadesService,
    private fb:FormBuilder,
    private imagenSrv:ImagenesService) {
      this.altaForm = this.fb.group({
        'email':['',[Validators.required, Validators.email]],
        'password':['', Validators.required],
        'nombre':['', Validators.required],
        'apellido':['', Validators.required],
        'dni':['',[Validators.required, Validators.min(1000000), Validators.max(99999999)]],
        'cuil':['',[Validators.required, Validators.min(10000000000), Validators.max(99999999999)]],
        'tipo':['', Validators.required]
      });
      this.email = '';
      this.clave = '';
     }

  ngOnInit() {}


  aceptar() {   
    this.utilidadesSrv.mostrartToast('Aceptado');
    this.utilidadesSrv.vibracionError(); 
    setTimeout(() => {
      this.utilidadesSrv.reproducirSonidoInicio();
    }, 5000);
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
    this.utilidadesSrv.vibracionError();
    this.utilidadesSrv.mostrartToast('Error al cargar la imagen.')
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
      this.utilidadesSrv.vibracionError();
      this.utilidadesSrv.mostrartToast('No tiene permisos.')
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
      this.utilidadesSrv.vibracionError();
      this.utilidadesSrv.mostrartToast('Error al escanear el documento.')
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


  Errores(error:any)
  {
    if(error.code == 'auth/email-already-in-use')
      {
        this.utilidadesSrv.errorToast('El correo ya está en uso.');
      }
      else if(error.code == 'auth/missing-email' || error.code == 'auth/internal-error')
      {
        this.utilidadesSrv.errorToast('No pueden quedar campos vacíos');
      }
      else if(error.code == 'auth/weak-password')
      {
        this.utilidadesSrv.errorToast('La contraseña debe tener al menos 8 caracteres');
      }
      else
      {
        this.utilidadesSrv.errorToast('Mail o contraseña invalidos');
      }
    }
}
