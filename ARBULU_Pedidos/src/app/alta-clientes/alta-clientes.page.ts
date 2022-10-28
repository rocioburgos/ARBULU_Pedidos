import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Photo } from '@capacitor/camera';
import { eUsuario, Usuario } from '../clases/usuario';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
import { ImagenesService } from '../servicios/imagenes.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-alta-clientes',
  templateUrl: './alta-clientes.page.html',
  styleUrls: ['./alta-clientes.page.scss'],
})
export class AltaClientesPage implements OnInit {

  email: string;
  clave: string;
  show_error: boolean = false; //
  descripcion_error: string = '';
  public altaForm: FormGroup; 
  public altaFormAnonimo: FormGroup; 
  habilitar:boolean;
  path:string='';
  anonimo:boolean = false;
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
    private imagenSrv:ImagenesService,
    private utilidadesSrv:UtilidadesService,
    private firestoreSvc: FirestoreService,
    private authSvc: AuthService
  ) {
    this.email = '';
    this.clave = '';
  }

  ngOnInit() {

    this.altaForm = this.fromBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      apellido: ['', Validators.compose([Validators.required])],
      dni: ['', Validators.compose([Validators.required, Validators.min(10000000), Validators.max(99999999)])],
      email: ["", [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      clave: ["", Validators.required]
    });

    this.altaFormAnonimo = this.fromBuilder.group({
      'nombre': ['', Validators.required]
    });
  }


  aceptar() {     
    
    var usuario = new Usuario();
    usuario.email = this.altaForm.value.email;
    usuario.nombre = this.altaForm.value.nombre;
    usuario.apellido = this.altaForm.value.apellido;
    usuario.DNI = this.altaForm.value.dni;
    usuario.tipo = eUsuario.cliente;
    usuario.nombre = this.altaForm.value.nombre;

    this.authSvc.Register(usuario.email, this.clave).then((userCredential)=>{
      this.firestoreSvc.crearUsuario(usuario).then((ok)=>{
        usuario.uid = ok.id;
        this.firestoreSvc.update(usuario.uid, {uid: usuario.uid}).then((ok)=>{
          this.utilidadesSrv.successToast(usuario.tipo + " dado de alta exitosamente.");
          this.navigateTo('home');
        })
      }).catch((err)=>{
        this.utilidadesSrv.errorToast(err);
      })
    }).catch((err)=>{
      this.Errores(err);
    })


    
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


  navigateTo(url: string) {
    setTimeout(() => {
      this.router.navigateByUrl(url);
    }, 2000);
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
