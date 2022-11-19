import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { eEstadPedido, Pedido } from '../clases/pedidos';
import { ApiService } from '../servicios/api.service';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
import { PedidosService } from '../servicios/pedidos.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-poke-preguntados',
  templateUrl: './poke-preguntados.page.html',
  styleUrls: ['./poke-preguntados.page.scss'],
})
export class PokePreguntadosPage implements OnInit {
  nombresPokemonTodos: string[] = [];
  pokemonNombre: string = '';
  pokemonImagen: string = '';
  nombresPokemonFalsos: string[] = [];
  jugando: boolean = false;
  puntaje: number = 0;
  puntajeFinal: number = 0;
  finalizado: boolean = false;
  pedido: any;
  usuarioActual:any;
  constructor(
    private pokeApi: ApiService,
    private utilidades:UtilidadesService,
    private spinner: NgxSpinnerService,
    private router:Router,
    private pedidos:PedidosService,
    private auth:AuthService,
    private firestoreSvc:FirestoreService
  ) {}

  ngOnInit(): void {
    this.pokeApi.ObtenerNombres().subscribe((data: any) => {
      data['results'].forEach((element: any) => {
        this.nombresPokemonTodos.push(element.name);
      });
    });
  }
  
  ionViewDidEnter(){
    this.usuarioActual = JSON.parse(localStorage.getItem('usuario_ARBULU'));
    this.firestoreSvc.obtenerColeccionUsuario().subscribe(data => {
      var usuarios = data; 

      usuarios.forEach(element => {  
        if (element.uid == this.usuarioActual.uid) { 
          this.usuarioActual = element;
          var observable2 = this.pedidos.TraerPedidos().subscribe((data)=>{
            this.pedido = data.filter((item:Pedido)=>item.estado != eEstadPedido.FINALIZADO && item.uid_usuario == this.usuarioActual.uid)[0];
           // this.pedidos.actualizarPedido({jugado:true}, this.pedido.doc_id)
            observable2.unsubscribe();
          });
        }
      });
    });

 
  }

  nuevoPokemon() {
    this.spinner.show();
    this.finalizado = false;
    var subscription = this.pokeApi.ObtenerPokemon().subscribe((data: any) => {
      this.nombresPokemonFalsos = [];
      this.pokemonNombre = data['name'];
      this.pokemonImagen = data['sprites'].front_default;

      this.nombresPokemonFalsos.push(this.pokemonNombre);
      for (let i = 0; i < 2; i++) {
        this.nombresPokemonFalsos.push(
          this.nombresPokemonTodos[
            Math.floor(Math.random() * (150 - 1 + 1) + 1)
          ]
        );
      }
      this.nombresPokemonFalsos = this.nombresPokemonFalsos.sort((a, b) => 0.5 - Math.random());
      subscription.unsubscribe();
      this.spinner.hide();
    });
    this.jugando = true;
  }

  check(nombreSeleccionado: string) {
    if (nombreSeleccionado == this.pokemonNombre) {
      this.rondaGanada();
    } else {
      this.rondaPerdida();
    }
  }

  rondaPerdida() {
    this.showError();
    this.finalizado = true;
    this.nombresPokemonFalsos = [];
    this.pokemonImagen = '';
    this.jugando = false;
    this.puntajeFinal = this.puntaje;
    this.puntaje = 0;
    this.finalizarJuego();
  }

  rondaGanada() {
    if(this.puntaje == 10)
    {
      this.finalizarJuego();
    }else{
      this.puntaje++;
      this.nuevoPokemon();  
    }
  }

  showSuccess() {
    this.utilidades.successToast('Correcto');
  }

  showError() {
    this.utilidades.errorToast('Incorrecto');
  }

  navigateTo(url: string) {
    setTimeout(() => {
      this.router.navigateByUrl(url);
    }, 2000);
  }

  finalizarJuego() {
    this.spinner.show();
    if (this.puntajeFinal == 10) {
      this.pedidos.actualizarPedido({jugado:true, descuento:10, nombreJuego:'poke-preguntados'}, this.pedido.doc_id).then((ok)=>{
        this.spinner.hide();
      });
    }else{
      this.pedidos.actualizarPedido({jugado:true,descuento:0, nombreJuego:'poke-preguntados'},this.pedido.doc_id).then((ok)=>{
        this.spinner.hide();
      });
    }
  }
}
