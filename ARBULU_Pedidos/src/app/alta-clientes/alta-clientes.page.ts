import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Photo } from '@capacitor/camera';
import { eUsuario, Usuario } from '../clases/usuario';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
import { ImagenesService } from '../servicios/imagenes.service';
import { MailService } from '../servicios/mail.service';
import { UtilidadesService } from '../servicios/utilidades.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../servicios/notification.service';

@Component({
  selector: 'app-alta-clientes',
  templateUrl: './alta-clientes.page.html',
  styleUrls: ['./alta-clientes.page.scss'],
})
export class AltaClientesPage implements OnInit {

  usuario: Usuario;
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
  fotoUrl='./../../assets/sacarfoto.png';
  usuarios:any;
  constructor(
    private spinner: NgxSpinnerService,
    private fromBuilder: FormBuilder,
    private router: Router ,
    private imagenSrv:ImagenesService,
    private utilidadesSrv:UtilidadesService,
    private firestoreSvc: FirestoreService,
    private authSvc: AuthService,
    private mail:MailService,
    private pushSrv:NotificationService
  ) {
    this.email = '';
    this.clave = '';
    this.usuario = new Usuario();

  }

  ngOnInit() {

    this.altaForm = this.fromBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      apellido: ['', Validators.compose([Validators.required])],
      dni: ['', Validators.compose([Validators.required, Validators.min(10000000), Validators.max(99999999)])],
      email: ["", [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      clave: ["", Validators.required],
      //clave2: ["", [Validators.required, this.comparePassValidator(this.altaForm.value.clave1, this.altaForm.value.clave2)]]
      clave2: ["", Validators.compose([Validators.required])],

    });

    this.altaFormAnonimo = this.fromBuilder.group({
      'nombre': ['', Validators.required]
    });


    this.firestoreSvc.obtenerUsuariosByTipo(eUsuario.dueño).subscribe((res)=>{
      this.usuarios= res;
    })
  }

  comparePassValidator(clave1: AbstractControl, clave2: AbstractControl) {
    return () => {
    if (clave1.value !== clave2.value)
      return { match_error: 'Las claves no coincides.' };
    return null;
  };

}


  aceptar() {     
    this.spinner.show();
    if(!this.anonimo){
      this.usuario.email = this.altaForm.value.email;
      this.usuario.nombre = this.altaForm.value.nombre;
      this.usuario.apellido = this.altaForm.value.apellido;
      this.usuario.dni = this.altaForm.value.dni;
      this.usuario.tipo = eUsuario.cliente;
      this.usuario.nombre = this.altaForm.value.nombre;

      /*this.authSvc.Register(this.usuario.email, this.clave).then((userCredential)=>{
        this.firestoreSvc.crearUsuario(this.usuario).then((ok)=>{
            this.mail.enviarEmail(this.usuario.nombre, this.usuario.email, "Su cuenta se encuentra pendiente aprobacion por parte del dueño o un supervisor.")
            this.utilidadesSrv.successToast(this.usuario.tipo + " dado de alta exitosamente.");
            this.utilidadesSrv.successToast("Espere la Aprobacón de la cuenta.", 3000);
            this.navigateTo('login');
        }).catch((err)=>{
          this.utilidadesSrv.errorToast(err);
        })
      }).catch((err)=>{
        this.Errores(err);
      });*/

      this.authSvc.register(this.usuario.email, this.clave).then((credential)=>{
        console.log(credential.user.uid);
        this.usuario.uid = credential.user.uid;
        this.firestoreSvc.setItemWithId(this.usuario, credential.user.uid).then((usuario)=>{
          console.log(usuario);
          this.notificar();
          setTimeout(() => {
            this.spinner.hide();
            this.utilidadesSrv.successToast('Registro exitoso');
            this.router.navigateByUrl('login')
          }, 3000); 
        }).catch((err)=>{
          this.Errores(err);
          this.utilidadesSrv.vibracionError();
          console.log(err);
        });
      }).catch((err)=>{
        this.Errores(err);
        this.utilidadesSrv.vibracionError();
        console.log(err);
      }); 
    }
    else{
      this.usuario.nombre = this.altaFormAnonimo.value.nombre;
      this.usuario.tipo = eUsuario.cliente;
      this.usuario.clienteValidado = true;
      this.firestoreSvc.crearUsuario(this.usuario).then((res:any)=>{
        this.pushSrv.RegisterFCM(res)
        console.log("id del anonimo "+res)
      });

      setTimeout(() => {
        this.utilidadesSrv.successToast("Ingreso exitoso.");
        this.navigateTo('qr-ingreso-local');
      }, 5000);

    }
 
  }


  notificar(){
    this.usuarios.forEach(user => {
      if(user.token!='' && user.tipo=='dueño' || user.tipo=='supervisor' ){
      this.pushSrv 
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        registration_ids: [
          // eslint-disable-next-line max-len
          user.token 
        ],
        notification: {
          title: 'Nuevo cliente',
          body: 'Se registro un nuevo cliente',
        },
        data: {
          ruta: 'listado-clientes-pendientes', 
        },
      })
      .subscribe((data) => {
        console.log(data);
      });}
    });
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
    this.spinner.show();
    this.uploadPhoto(photo).then(() => {
       
      setTimeout(() => {
        this.habilitar = true; 
        this.spinner.hide();
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
    
    uploadTask.then(async res => {
      const downloadURL = await res.ref.getDownloadURL();
      if (downloadURL.length > 0) {
        console.log("URL  CORRECTO- i_IMG++");
        this.fotoUrl= downloadURL;
        console.log("IMAGEN CARGADA CORRECTAMENTE");
        return this.usuario.foto = downloadURL;
        
      }
    })
      .catch((err) => {
        console.log("Error al subbir la imagen: ", err);
      });
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
