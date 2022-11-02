import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-home-metre',
  templateUrl: './home-metre.page.html',
  styleUrls: ['./home-metre.page.scss'],
})
export class HomeMetrePage implements OnInit {
 
  constructor(private authSrv:AuthService,
    private utilidadesSvc:UtilidadesService,
    private router:Router) {}
  
  ngOnInit() {
  }
  
  cerrarSesion(){
    this.authSrv.signOut().then(()=>{
      this.utilidadesSvc.warningToast("Cerrando sesion.",2000);
      setTimeout(() => {
        this.router.navigate(['login']); 
      }, 2500);
    });
  }
}
