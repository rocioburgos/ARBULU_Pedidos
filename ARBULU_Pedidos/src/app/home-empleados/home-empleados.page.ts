import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-home-empleados',
  templateUrl: './home-empleados.page.html',
  styleUrls: ['./home-empleados.page.scss'],
})
export class HomeEmpleadosPage implements OnInit {

  constructor(private authSvc:AuthService,
    private utilidadesSvc:UtilidadesService,
    private router:Router) { }

  ngOnInit() {
  }

  cerrarSesion(){
    this.authSvc.signOut().then(()=>{
      this.utilidadesSvc.warningToast("Cerrando sesion.",2000);
      setTimeout(() => {
        this.router.navigate(['login']); 
      }, 2500);
    });
  }
}
