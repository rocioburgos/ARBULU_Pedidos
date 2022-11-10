import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImagenesService } from '../servicios/imagenes.service';
import { Photo } from '@capacitor/camera';
import { EncuestaService } from '../servicios/encuesta.service';

@Component({
  selector: 'app-encuesta-empleado',
  templateUrl: './encuesta-empleado.page.html',
  styleUrls: ['./encuesta-empleado.page.scss'],
})
export class EncuestaEmpleadoPage implements OnInit {

  path: string = './../../assets/sacarfoto.png';
  
  public surveyForm: FormGroup;
  habilitar: boolean=false;
  public currentUser: any; //Datos de la sesion
  public survey: any = {
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: false
  }
  public questions: any;
  reportedUser: any;
  checkedYes: boolean = false;
  checkedNo: boolean = false;
  reportedUsername: string;
  submitted: boolean;
  showOK:boolean  = false;
  showSpinner: boolean = false;
  showForm : boolean = true;
  nroImagen: number = 0;
 
  errorImagen: boolean;
  constructor(private fromBuilder: FormBuilder, public route: ActivatedRoute,
    private imagenSrv: ImagenesService, public router: Router,
    private spinner: NgxSpinnerService, private encuestasSrv:EncuestaService ) {
    this.surveyForm = this.fromBuilder.group({
      q1: [this.survey.q1, Validators.compose([Validators.required])],
      q2: [this.survey.q2, Validators.compose([Validators.required])],
      q3: [this.survey.q3, Validators.compose([Validators.required])],
      q4: [this.survey.q4, Validators.compose([Validators.required, Validators.minLength(4)])],
      q5: [this.survey.q4, Validators.compose([Validators.required])]
    })
   }

  ngOnInit() {
    //Recupera datos de sesion
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    this.reportedUsername = this.route.snapshot.paramMap.get('username')
    console.log(this.reportedUsername)
    this.submitted = false
    //Dependiendo el tipo de cliente la encuesta que muestro

  }

  SubmitEncuesta(){
    console.log(this.surveyForm.valid)
    this.submitted = true;
    if (!this.surveyForm.invalid) {
      let nuevoReporte = {
        comentarios: this.surveyForm.get('q4').value,
        estaContento: this.surveyForm.get('q5').value,
        orden: this.surveyForm.get('q3').value,
        limpieza: this.surveyForm.get('q2').value,
        tareasAnteriores: this.surveyForm.get('q1').value,
        userName: this.reportedUsername,
        img_src: this.path
      }
      this.encuestasSrv.NuevaEncuestaEmpleado(nuevoReporte)
      localStorage.setItem("solvedSurvey","true");
      this.ClossingMessage();
    } else {
      
    }
  }

  ClossingMessage() {
    this.spinner.show()
    setTimeout(() => {
      this.showForm = false
      this.spinner.hide()
      this.showOK = true;
      setTimeout(() => {
        this.router.navigate(['home-cocinero'])
      }, 2000);
    }, 2000);
  }


  /*********************************** */
  tomarFoto() {
    this.addPhotoToGallery();
  }

  async addPhotoToGallery() {
    //abrir camara y tomar la foto
    const photo = await this.imagenSrv.addNewToGallery();

    //subir la foto
    this.spinner.show();
    this.uploadPhoto(photo).then(() => {

      setTimeout(() => {
        this.habilitar = true;
        this.spinner.hide()
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

    //Subir la foto
    const uploadTask = this.imagenSrv.saveFile(blob, filePath);


    uploadTask.then(async res => {
      //obtener el link de la foto 
      const downloadURL = await res.ref.getDownloadURL();
      if (downloadURL.length > 0) {
        this.path = downloadURL; 
      } else {
        console.log("IMAGEN NO CORRECTA  ");
      }
    })
      .catch((err) => {
        console.log("Error al subbir la imagen: ", err);
      });
  }

  getFilePath() {
    return new Date().getTime() + '-empleados';
  }


}
