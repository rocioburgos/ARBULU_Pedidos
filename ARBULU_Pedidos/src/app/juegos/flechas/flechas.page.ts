import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { Puntos } from 'src/app/clases/puntos';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { PedidosService } from 'src/app/servicios/pedidos.service';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';

@Component({
  selector: 'app-flechas',
  templateUrl: './flechas.page.html',
  styleUrls: ['./flechas.page.scss'],
})
export class FlechasPage implements OnInit {

  imagenes = [
    { src: '../../../assets/flechas/arriba.jpg', direccion: "arriba" },
    { src: '../../../assets/flechas/abajo.jpg', direccion: "abajo" },
    { src: '../../../assets/flechas/derecha.jpg', direccion: "derecha" },
    { src: '../../../assets/flechas/izquierda.jpg', direccion: "izquierda" },
    { src: '../../../assets/flechas/arriba1.jpg', direccion: "arriba" },
    { src: '../../../assets/flechas/abajo1.jpg', direccion: "abajo" },
    { src: '../../../assets/flechas/derecha1.jpg', direccion: "derecha" },
    { src: '../../../assets/flechas/izquierda1.jpg', direccion: "izquierda" },
    { src: '../../../assets/flechas/arriba2.jpg', direccion: "arriba" },
    { src: '../../../assets/flechas/abajo2.jpg', direccion: "abajo" },
    { src: '../../../assets/flechas/derecha2.jpg', direccion: "derecha" },
    { src: '../../../assets/flechas/izquierda2.jpg', direccion: "izquierda" },
    { src: '../../../assets/flechas/arriba3.jpg', direccion: "arriba" },
    { src: '../../../assets/flechas/abajo3.jpg', direccion: "abajo" },
    { src: '../../../assets/flechas/derecha3.jpg', direccion: "derecha" },
    { src: '../../../assets/flechas/izquierda3.jpg', direccion: "izquierda" },
    { src: '../../../assets/flechas/arriba4.jpg', direccion: "arriba" },
    { src: '../../../assets/flechas/abajo4.jpg', direccion: "abajo" },
    { src: '../../../assets/flechas/derecha4.jpg', direccion: "derecha" },
    { src: '../../../assets/flechas/izquierda4.jpg', direccion: "izquierda" },
    { src: '../../../assets/flechas/arriba5.jpg', direccion: "arriba" },
    { src: '../../../assets/flechas/abajo5.jpg', direccion: "abajo" },
    { src: '../../../assets/flechas/derecha5.jpg', direccion: "derecha" },
    { src: '../../../assets/flechas/izquierda5.jpg', direccion: "izquierda" },
  ];

  currentImage: any = "";
  puntaje: number = 0;
  empezado: boolean = false;
  timeLeft: number = 60;
  interval: any;
  tiempoTerminado: boolean = false;
  listaPuntajes: Array<Puntos> = new Array<Puntos>();
  listaOrdenada: Array<Puntos> = new Array<Puntos>();
  usuario: Usuario = new Usuario();
  public usuario$: Observable<any> = this.authService.afAuth.user;
  pedidos: any = [];
  pedido: any;

  constructor(public router: Router, 
    public authService: AuthService, 
    private pedidoSvc: PedidosService, 
    private spinner:NgxSpinnerService,
    private utilidades:UtilidadesService) {
    //this.puntajeSvc.cargarPuntajesFchs();
    this.usuario$.subscribe((result: any) => {
      this.usuario.email = result['email'];
      this.usuario.uid = result['uid']

    });
    this.pedidoSvc.TraerPedidos().subscribe(data => {
      this.pedidos = data;
      this.pedidos.forEach(element => {
        if (element.uid_usuario == this.usuario.uid) {
          this.pedido = element;
          console.log(this.pedido);
          this.pedidos.actualizarPedido({jugado:true}, this.pedido.doc_id)
          console.log("Pedido actualizado, jugado en true");
        }
      });
    });
  }

  ngOnInit(): void {

  }

  empezar() {
    this.currentImage = this.updateRandomImage();
    this.empezado = true;
    this.tiempoTerminado = false;
    this.puntaje = 0;
    this.startTimer();
  }

  updateRandomImage() {
    const i = Math.floor(Math.random() * (this.imagenes.length - 1)) + 0;
    return this.imagenes[i];
  }

  getImage() {
    return this.currentImage.src;
  }

  onArriba() {
    console.log(this.currentImage.direccion);
    if (this.currentImage.direccion.includes("arriba")) {
      this.puntaje += 10;
      this.currentImage = this.updateRandomImage();
    }
    else {
      this.puntaje -= 5;
      this.currentImage = this.updateRandomImage();
    }
  }

  onAbajo() {
    console.log(this.currentImage.direccion);
    if (this.currentImage.direccion.includes("abajo")) {
      this.puntaje += 10;
      this.currentImage = this.updateRandomImage();
    }
    else {
      this.puntaje -= 5;
      this.currentImage = this.updateRandomImage();
    }
  }

  onIzquierda() {
    console.log(this.currentImage.direccion);
    if (this.currentImage.direccion.includes("izquierda")) {
      this.puntaje += 10;
      this.currentImage = this.updateRandomImage();
    }
    else {
      this.puntaje -= 5;
      this.currentImage = this.updateRandomImage();
    }
  }

  onDerecha() {
    console.log(this.currentImage.direccion);
    if (this.currentImage.direccion.includes("derecha")) {
      this.puntaje += 10;
      this.currentImage = this.updateRandomImage();
    }
    else {
      this.puntaje -= 5;
      this.currentImage = this.updateRandomImage();
    }
  }



  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
        this.tiempoTerminado = true;
        this.empezado = false;
        console.log(this.puntaje);
        this.pedido.jugado = true;
        this.pedido.descuento = this.puntaje < 800 ? 0 : 20;
        this.updatePedidoPuntaje();
        
        if (this.tiempoTerminado) {
          this.pauseTimer();
          this.router.navigate(['home-cliente']);
        }

      }
    }, 1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  updatePedidoPuntaje() {
    this.spinner.show();
    this.pedidos.actualizarPedido({jugado:true, descuento:this.pedido.descuento, nombreJuego:'flechas'}, this.pedido.doc_id).then((ok)=>{
      if(this.pedido.descuento == 20)
      {
        this.utilidades.successToast("Felicitaciones, ha logrado un 20% de descuento!", 4000);
      }
      else{
        this.utilidades.warningToast("No ha logrado el descuento, mejor suerte la proxima!", 4000)
      }
      setTimeout(()=>{
        this.router.navigate(['home-cliente']);
        this.spinner.hide();
        console.log("Pedido actualizado, jugado en true, descuento y juegoJugado en flechas");
      },4000);
    }).catch((err)=>{
      setTimeout(()=>{
        this.router.navigate(['home-cliente']);
        this.spinner.hide();
      },4000)
    });
  }





}
