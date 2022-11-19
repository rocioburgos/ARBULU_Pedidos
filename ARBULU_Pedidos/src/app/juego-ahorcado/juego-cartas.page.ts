import { Component, OnInit } from '@angular/core';  
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/servicios/auth.service';
import { eEstadPedido, Pedido } from '../clases/pedidos';
import { FirestoreService } from '../servicios/firestore.service';
import { PedidosService } from '../servicios/pedidos.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-cartas',
  templateUrl: './juego-cartas.page.html',
  styleUrls: ['./juego-cartas.page.scss'],
})
export class JuegoCartasPage implements OnInit {

  
  cartaPrincipal;
  cartaSecundaria;
  mensaje!:string;
  descuento:number = 0;
  cuenta: number = 0;
  vidas: number = 3;
  mostrarFin: boolean= false;
  pedido: any;
  usuarioActual:any;
  cartas = [{ numero: 1, pathImg: './../../../../assets/juegos/mayorMenor/cartas/1.jpg' },
  { numero: 2, pathImg: './../../../../assets/juegos/mayorMenor/cartas/2.jpg' },
  { numero: 3, pathImg: './../../../../assets/juegos/mayorMenor/cartas/3.jpg' },
  { numero: 4, pathImg: './../../../../assets/juegos/mayorMenor/cartas/4.jpg' },
  { numero: 5, pathImg: './../../../../assets/juegos/mayorMenor/cartas/5.jpg' },
  { numero: 6, pathImg: './../../../../assets/juegos/mayorMenor/cartas/6.jpg' },
  { numero: 7, pathImg: './../../../../assets/juegos/mayorMenor/cartas/7.jpg' },
  //{ numero: 8, pathImg: './../../../../assets/juegos/mayorMenor/cartas/8.jpg' },
  { numero: 9, pathImg: './../../../../assets/juegos/mayorMenor/cartas/9.jpg' },
  { numero:10, pathImg: './../../../../assets/juegos/mayorMenor/cartas/10.jpg' },
  { numero:11, pathImg: './../../../../assets/juegos/mayorMenor/cartas/11.jpg' },
  { numero:12, pathImg: './../../../../assets/juegos/mayorMenor/cartas/12.jpg' },

];


  constructor( private authSrv:AuthService,
    private utilSrv:UtilidadesService,
    private pedidoSrv:PedidosService,
    private spinner:NgxSpinnerService,
    private firestoreSvc:FirestoreService) {
    this.cartaPrincipal = this.calcularCartaRandom();
    this.cartaSecundaria = this.calcularCartaRandom();
  }

  
  ionViewDidEnter(){
    this.usuarioActual = JSON.parse(localStorage.getItem('usuario_ARBULU'));
    this.firestoreSvc.obtenerColeccionUsuario().subscribe(data => {
      var usuarios = data; 

      usuarios.forEach(element => {  
        if (element.uid == this.usuarioActual.uid) { 
          this.usuarioActual = element;
          var observable2 = this.pedidoSrv.TraerPedidos().subscribe((data)=>{
            this.pedido = data.filter((item:Pedido)=>item.estado != eEstadPedido.FINALIZADO && item.uid_usuario == this.usuarioActual.uid)[0];
           // this.pedidos.actualizarPedido({jugado:true}, this.pedido.doc_id)
            observable2.unsubscribe();
          });
        }
      });
    });

 
  }

  counter(i: number) {
    return new Array(i);
}
  ngOnInit(): void {
  }


  calcularCartaRandom() {
    return this.cartas[Math.floor(Math.random() * this.cartas.length)];
  }

  play(res:string){
    if(this.respuesta(res)){
      this.cuenta++;
      this.cartaPrincipal = this.cartaSecundaria;
      this.cartaSecundaria= this.calcularCartaRandom();
      this.mensaje ='BIEN!';
      this.utilSrv.successToast('¡Bien! Sumaste un acierto');
      if(this.cuenta==5){
        this.mostrarFin= true; 
        this.utilSrv.successToast('¡Felicitaciones! Ganaste el descuento',5000);
        this.descuento = 15;
        this.guardarResultados();
      }
    }else{
      if(this.vidas > 0){ 
      this.vidas--;
      this.mensaje ='NO :(';
      this.utilSrv.errorToast('No es por ahi...');
      
      this.cartaPrincipal = this.cartaSecundaria;
      this.cartaSecundaria= this.calcularCartaRandom();
      if(this.vidas == 0){
        this.mostrarFin= true; 

        //le bajo la cuenta para que sea mas facil ganar, el original es cuenta= 5
        if(this.cuenta ==2){
        this.utilSrv.successToast('¡Felicitaciones! Ganaste el descuento',5000);
        this.descuento = 15;
       }else{
        this.utilSrv.errorToast('No ganaste el descuento ¡suerte la proxima!',5000)
       }
        this.guardarResultados();
      }
    }
    }
  }


  respuesta(res: string):boolean{ 
    switch (res) {
      case 'mayor':
        if (this.cartaPrincipal.numero > this.cartaSecundaria.numero) {
          return true;
        } else {
          return false;
        }
        break;

      case 'igual':
        if (this.cartaPrincipal.numero == this.cartaSecundaria.numero) {
          return true;
        } else {
          return false;
        }
        break;
      case 'menor':
        if (this.cartaPrincipal.numero < this.cartaSecundaria.numero) {
          return true;
        } else {
          return false;
        }
        break;
      default:
        return false;
        break;
    }
  }

  reload() {
    window.location.reload();
  }

  guardarResultados(){
     //guardar en firebase
     let now = new Date();
     let fecha = now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear(); 
     let email = this.authSrv.getCurrentUserLS().email;
     //let resultados = { 'email': email, 'fecha':fecha, 'juego': 'mayorMenor', 'puntaje': this.cuenta }
     this.spinner.show();
     this.pedidoSrv.actualizarPedido({jugado:true, descuento:this.descuento, nombreJuego:'cartas'}, this.pedido.doc_id).then((ok)=>{
     this.spinner.hide();
    }).catch((err)=>{
      this.spinner.hide();
    });
  }
}
