import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../servicios/api.service';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
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

  constructor(
    private pokeApi: ApiService,
    private utilidades:UtilidadesService,
    private spinner: NgxSpinnerService,
    private router:Router,
    private firestore:FirestoreService
  ) {}

  ngOnInit(): void {
    this.pokeApi.ObtenerNombres().subscribe((data: any) => {
      data['results'].forEach((element: any) => {
        this.nombresPokemonTodos.push(element.name);
      });
    });
  }
  
  ionViewDidEnter(){
    
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
    if (this.puntajeFinal == 10) {
      
    }else{

    }
  }
}
