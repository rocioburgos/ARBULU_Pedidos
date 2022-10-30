import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Productos } from 'src/app/clases/productos';
   
 
import { Observable } from 'rxjs';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Photo } from '@capacitor/camera';
//import { timingSafeEqual } from 'crypto';
import { Router } from '@angular/router'; 
import { ImagenesService } from '../servicios/imagenes.service';
import { ProductosService } from '../servicios/productos.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.page.html',
  styleUrls: ['./alta-producto.page.scss'],
})
export class AltaProductoPage implements OnInit {

  public producto: Productos;
  public currentUser: any; //Datos de la sesion
  public productosList: Productos[]; //Toda las mesas que existen.
  public formProducto: FormGroup;
  public i_NroImagen: number = 0;
  public imagenPerfil = "../../../assets/plato.png";
  public errorImagen: boolean;
  public uploadProgress: number;
  public habilitarFotosBTN = false;

  constructor(private fb: FormBuilder,
    private route: Router, 
    public prodSrv: ProductosService,
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
    this.producto = new Productos();
    this.producto.img_src = new Array();
    //  this.validarAltaProducto(this.formProducto);
    this.formProducto = this.fb.group({
      'nombre': ['', [Validators.required]],
      'descripcion': ['', [Validators.required]],
      'tiempo': ['', [Validators.required]],
      'precio': ['', [Validators.required]],
      'sector': ['', [Validators.required]]
    }); 
  }

  private validarCantidadFotos(): boolean {
    this.errorImagen = (this.i_NroImagen == 3) ? false : true;
    return this.errorImagen;
  }
 
  GuardarNuevoProducto() {
    this.producto.nombre = this.formProducto.get('nombre').value;
    this.producto.descripcion = this.formProducto.get('descripcion').value;
    this.producto.tiempo_elaboracion = this.formProducto.get('tiempo').value;
    this.producto.precio = this.formProducto.get('precio').value;
    this.producto.sector = this.formProducto.get('sector').value;
    if (!this.validarCantidadFotos()) {
      this.errorImagen = false;
      var resp = this.prodSrv.GuardarNuevoProducto(this.producto)
      if (resp) {
        console.log("Producto guardado con exito");
        this.utilSrv.successToast("Producto guardado con exito");
        //exito al guardar
     //   this.toastCtrl.presentToast("Se guardo con el exito el producto", 2000,"success")
        this.route.navigate(['/home']);
      }
      else {
        this.utilSrv.errorToast("Error al guardar el nuevo producto")
        console.log("error al guardar el nuevo producto ");
      }

      console.log("Nuevo producto a guardar: " + this.producto.nombre + " " + this.producto.img_src);
    } else {
      //mostrar el error de las imagenes
      this.errorImagen = true;
      console.log("FALTAN LAS FOTOS");
      this.utilSrv.warningToast('Faltan fotos del producto')
    }

  }

  tomarFotoProducto() {
    if (this.i_NroImagen < 3 ) {
      this.addPhotoToGallery();
    }
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

    console.log("nro actual de fotos cargadas: " + this.i_NroImagen);
    uploadTask.then(async res => {
      const downloadURL = await res.ref.getDownloadURL();
      if (downloadURL.length > 0) {
        console.log("URL  CORRECTO- i_IMG++");
        this.producto.img_src.push(downloadURL);

        this.i_NroImagen++;
        console.log("Cntidad fotos cargadas: " + this.i_NroImagen + "\n URL:" + this.producto.img_src);
        console.log(this.producto.img_src);
      } else {
        console.log("IMAGEN NO CORRECTA . NO SE CONTABILIZA " + this.i_NroImagen);
      }
      this.validarCantidadFotos();
    })
      .catch((err) => {
        console.log("Error al subbir la imagen: ", err);
      });
  }


  getFilePath() {
    return new Date().getTime() + '-productos';
  }
}
