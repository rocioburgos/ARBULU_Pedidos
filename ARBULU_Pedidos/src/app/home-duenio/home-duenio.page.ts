import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
import { NotificationService } from '../servicios/notification.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-home-duenio',
  templateUrl: './home-duenio.page.html',
  styleUrls: ['./home-duenio.page.scss'],
})
export class HomeDuenioPage implements OnInit {

  usuarioActual: any;
  userData:any;
  constructor(private authSvc:AuthService,
    private utilidadesSvc:UtilidadesService,
    private router:Router,
    private alertController:AlertController,
    private spinner:NgxSpinnerService,
    private fireSrv:FirestoreService,
    private notiSrv:NotificationService) {

     }

  ngOnInit() { 
    this.usuarioActual = JSON.parse(localStorage.getItem('usuario_ARBULU'));  
    this.fireSrv.usuarioPorId(this.usuarioActual.uid).subscribe((res)=>{
      
      this.userData=res[0]; 
      this.notiSrv.inicializar(this.userData)
    })
  }
  async cerrarSesion(){

    const alert = await this.alertController.create({
      header: '¿Seguro que quiere cerrar sesión?',
      cssClass: 'alertSesion',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'

        },
        {
          text: 'Si',
          role: 'confirm',
          handler: () => {
          
            this.spinner.show(); 
            this.utilidadesSvc.warningToast("Cerrando sesion.",2000);
            this.userData.token='';
             this.fireSrv.actualizarToken( '', this.usuarioActual.uid).finally(()=>{
              this.authSvc.signOut().then(()=>{ 
                setTimeout(() => {
                 
                  this.spinner.hide();
                  this.router.navigate(['login']); 
                }, 3000);
              });
             });

           

          },
        },
      ],
    });  
    await alert.present(); 


  }
}
