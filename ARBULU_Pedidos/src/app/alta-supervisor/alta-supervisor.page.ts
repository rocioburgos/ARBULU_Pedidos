import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../servicios/firestore.service';
import { ImagenesService } from '../servicios/imagenes.service';
import { UtilidadesService } from '../servicios/utilidades.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Photo } from '@capacitor/camera';
import { eUsuario, Usuario } from '../clases/usuario';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
})
export class AltaSupervisorPage implements OnInit {
  usuario:Usuario;
  
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

  constructor(private router:Router, 
    private firestore:FirestoreService, 
    private utilidadesSrv:UtilidadesService,
    private fb:FormBuilder,
    private imagenSrv:ImagenesService,
    private auth:AuthService) {
      this.altaForm = this.fb.group({
        'email':['',[Validators.required, Validators.email]],
        'password':['', [Validators.required, Validators.minLength(8)]],
        'nombre':['', Validators.required],
        'apellido':['', Validators.required],
        'dni':['',[Validators.required, Validators.min(1000000), Validators.max(99999999)]],
        'cuil':['',[Validators.required, Validators.min(10000000000), Validators.max(99999999999)]],
        'tipo':['', Validators.required],
        'perfil':['', Validators.required]
      });
      this.usuario = new Usuario();
      this.clave = '';
     }

  ngOnInit() {}


  aceptar() {
    this.altaForm.get('perfil').value == 'dueño' ? this.usuario.tipo = eUsuario.dueño : this.usuario.tipo = eUsuario.supervisor;

    this.auth.register(this.usuario.email, this.clave).then((userCredential)=>{
      this.firestore.crearUsuario(this.usuario).then((ok)=>{
        this.usuario.uid = ok.id;
        this.firestore.update(this.usuario.uid, {id: this.usuario.uid}).then((ok)=>{
          this.utilidadesSrv.successToast(this.usuario.tipo + " dado de alta exitosamente.");
          this.navigateTo('home');
        })
      }).catch((err)=>{
        this.utilidadesSrv.errorToast(err);
      })
    }).catch((err)=>{
      this.Errores(err);
    })
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
      this.utilidadesSrv.errorToast("Error al subir imagen");
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
        
        let digitosCUIL = this.dniData[8];
        let cuil = digitosCUIL[0] + digitosCUIL[1] + this.dniData[4] + digitosCUIL[2];

        this.usuario.dni = this.dniData[4].trim();
        this.usuario.nombre = this.dniData[2].trim();
        this.usuario.apellido = this.dniData[1].trim();
        this.usuario.cuil = cuil.trim();
        
        document.querySelector('body').classList.remove('scanner-active');
        this.scanActive = false; 
      }
    } catch (error) {
      this.utilidadesSrv.vibracionError();
      this.utilidadesSrv.errorToast('Error al escanear el documento.')
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
