import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { LoadingController, NavController } from '@ionic/angular';
import { Mesa } from '../clases/mesa';
import { FirestoreService } from '../servicios/firestore.service';
import { ImagenesService } from '../servicios/imagenes.service';
import { ProductosService } from '../servicios/productos.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.page.html',
  styleUrls: ['./alta-mesa.page.scss'],
})
export class AltaMesaPage implements OnInit {

  public mesa: Mesa;
  public currentUser: any; //Datos de la sesion
  public mesasList: Mesa[]; //Toda las mesas que existen.
  public formMesa: FormGroup;
  public i_NroImagen: number = 0;
  public imagenPerfil = "../../../assets/plato.png";
  public errorImagen: boolean;
  public uploadProgress: number;
  public habilitarFotosBTN = false;

  constructor(private fb: FormBuilder,
    private route: Router, 
    public firestore:FirestoreService,
    private loadingController: LoadingController, 
    public navCtrl: NavController,
    private imagenSrv:ImagenesService,
    private utilSrv:UtilidadesService
    ) {

  }

  navigateBack(){
    this.navCtrl.back();
  }
  ngOnInit() {
    this.mesa = new Mesa();
    this.mesa.img_src = '';
    //  this.validarAltaProducto(this.formProducto);
    this.formMesa = this.fb.group({
      'numero': ['', [Validators.required]],
      'cantidadComensales': ['', [Validators.required]],
      'tipoMesa': ['', [Validators.required]],
    });
    /*if(this.validarCantidadFotos()){
      this.habilitarFotosBTN= true;
    }*/

  }
 
  GuardarMesa() {
    this.mesa.numero = this.formMesa.get('numero').value;
    this.mesa.cantidadComensales = this.formMesa.get('cantidadComensales').value;
    this.mesa.tipo = this.formMesa.get('tipoMesa').value;      

    this.firestore.crearMesa(this.mesa)
    .then((ok) => {
      this.utilSrv.successToast('Mesa guardada con exito');
     
      console.log("GOOD");
    })
    .catch((err) => {
      this.utilSrv.successToast('Error.No se guardo la mesa.');
      console.log(err);
    });
  }

  tomarFotoProducto() {
      this.addPhotoToGallery();
  }

  async addPhotoToGallery() {
    const photo = await this.imagenSrv.addNewToGallery();
    this.uploadPhoto(photo).then().catch((err) => {
      console.log("Error addPhotoToGallery", err);
    });
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
        this.mesa.img_src = downloadURL;
      } else {
        console.log("IMAGEN NO CORRECTA . NO SE CONTABILIZA " + this.i_NroImagen);
      }
    })
      .catch((err) => {
        console.log("Error al subbir la imagen: ", err);
      });
  }


  getFilePath() {
    return new Date().getTime() + '-test';
  }
}
