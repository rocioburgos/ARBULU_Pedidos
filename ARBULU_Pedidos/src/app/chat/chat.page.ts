import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Mensaje } from '../clases/mensaje';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
import { MensajeService } from '../servicios/mensaje.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  perfil = 'MOZO'
  remitente: string = '';
  destinatario: string = '';//el usuario Actual, depende de si estoy mandando o recibiendo mensajes
  fecha: string = '';
  hora: string = '';
  //mensajes?:Mensaje;
  mensaje: string = '';
  mensajeEnviar: string = '';
  usuario_actual: any;

  mensajes: Array<any> = [];
  nroMesa = '0';
  user: any;
  constructor(private msjSrv: MensajeService,
    private authSrv: AuthService
    , private spiner: NgxSpinnerService,
    private userSrv: FirestoreService) { }

  async ngOnInit() {
    this.mostrarRecientes();
    this.usuario_actual = this.authSrv.getCurrentUserLS();
 
    this.user = (await this.userSrv.getUserByUid('' + this.usuario_actual?.uid).toPromise()).data();
    if (this.usuario_actual.tipo == 'cliente') {
       //obtener su mesa
      this.userSrv.obtenerMesaPorNumero(this.user.mesa).subscribe((res) => {
        this.nroMesa = res[0].numero;
      });
    }
  }


  mostrarRecientes() {

    this.spiner.show();
    this.msjSrv.traerMensajes().subscribe((data) => {

      setTimeout(() => {
        this.mensajes = data;
        this.mensajes.sort();
        console.log(data);
        this.spiner.hide();
      }, 2000);
    });

  }


  mandarMensaje() {
    try {
      let date = new Date();
      if (this.mensajeEnviar != '' && this.mensajeEnviar != null && this.mensajeEnviar) {
        let mensaje: Mensaje = new Mensaje(this.user.email, this.mensajeEnviar, this.horario(), this.nroMesa, date);
        console.log(mensaje)
        this.msjSrv.nuevoMensaje(mensaje).then((res) => {
          this.mensajeEnviar = '';
        }).catch((err) => {
          console.log(err);
        });
      }

    } catch (error) {
      console.log(error);
    }
  }

  horario(): string {
    let date: Date = new Date();
    let fecha: string = date.getDate().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString()
      + ' ' + date.getHours().toString() + ':' + date.getMinutes().toString();
    return fecha;
  }
}