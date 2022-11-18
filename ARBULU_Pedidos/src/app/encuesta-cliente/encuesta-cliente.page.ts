import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../servicios/auth.service';
import { EncuestaService } from '../servicios/encuesta.service';
import { FirestoreService } from '../servicios/firestore.service';
import { PedidosService } from '../servicios/pedidos.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.page.html',
  styleUrls: ['./encuesta-cliente.page.scss'],
})
export class EncuestaClientePage implements OnInit {

  form!: FormGroup;
  fotos: FormData = new FormData();
  encuestas: Array<any> = [];

  constructor(private router: Router,
    public firestore: FirestoreService,
    private fb: FormBuilder,
    private utilidades:UtilidadesService,
    private auth:AuthService,
    private spinner: NgxSpinnerService,
    private pedido:PedidosService,
    private encuestasSvc:EncuestaService) {
    this.form = this.fb.group({
      'puntaje': ['', Validators.required],
      'inconvenientes': ['', Validators.required],
      'orden': [true],
      'comentario': [''],
      'quejas': ['', Validators.required],
      'foto1': [''],
      'foto2': [''],
      'foto3': [''],
      'uid_cliente': [this.auth.usuarioActual.uid],
      'uid_pedido': [this.pedido.pedido_uid]
    });
  }

  ngOnInit() { }

  SubirFoto1(e: any) {
    this.fotos.append('foto1', e.target.files[0]);
  }
  SubirFoto2(e: any) {
    this.fotos.append('foto2', e.target.files[0]);
  }
  SubirFoto3(e: any) {
    this.fotos.append('foto3', e.target.files[0]);
  }

  EnviarEncuesta() {
    this.spinner.show();
    this.firestore.SubirEncuestaCliente(this.form.value, this.fotos)
      .then(() => {
        document.getElementById('enviar').setAttribute('disabled', 'disabled');

        setTimeout(() => {
          this.utilidades.successToast("Se registró la encuesta correctamente.");
          this.encuestasSvc.encuesta = true;
          this.spinner.hide();
          this.router.navigate(['/home-cliente']);
        }, 2000);

      }).catch(error => {
        this.utilidades.errorToast("Ocurrió un error al registrar la encuesta.");
        this.spinner.hide();
      });
  }
}
