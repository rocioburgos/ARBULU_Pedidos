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
 
  remitente: string = '';
  destinatario: string = '';//el usuario Actual, depende de si estoy mandando o recibiendo mensajes
  fecha: string = '';
  hora: string = '';
  //mensajes?:Mensaje;
  mensaje: string = '';
  mensajeEnviar: string = '';
  usuario_actual: any;

  mensajes: Array<any> = [];
  nroMesa = '';
  user: any;
  mesasOcupadas:any;
  flagMesaElegida= false;
  constructor(private msjSrv: MensajeService,
    private authSrv: AuthService
    , private spiner: NgxSpinnerService,
    private userSrv: FirestoreService) { }

  async ngOnInit() {
    this.spiner.show()
    this.usuario_actual = this.authSrv.getCurrentUserLS();
 
    this.user = (await this.userSrv.getUserByUid('' + this.usuario_actual?.uid).toPromise()).data();
    if (this.usuario_actual.tipo == 'cliente') {
       //obtener su mesa
      this.userSrv.obtenerMesaPorNumero(this.user.mesa).subscribe((res) => {
        this.nroMesa = res[0].numero;
        
        this.msjSrv.traerMensajesPorMesa(this.nroMesa).subscribe((data)=>{
          this.mensajes = data;
        });
      });
    }else if(this.usuario_actual.tipo == 'empleado' && this.usuario_actual.tipoEmpleado == 'mozo'){
      //cargar todos los numeros de mesa ocpados
      this.userSrv.obtenerMesasOcupadas().subscribe((res)=>{
        this.mesasOcupadas= res;
      })
    }

    setTimeout(() => {
      this.spiner.hide();
    }, 3000);
  }

  mesaElegida(data:any){
    this.spiner.show();
    console.log(data.detail.value)  
    let numero = data.detail.value;
    this.nroMesa= numero;
    this.flagMesaElegida= true;
    this.msjSrv.traerMensajesPorMesa(numero).subscribe((data)=>{
      this.mensajes = data;
    });

    setTimeout(() => {
      this.spiner.hide();
    }, 3000);
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