import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../clases/usuario';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
import { MailService } from '../servicios/mail.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-listado-clientes-pendientes',
  templateUrl: './listado-clientes-pendientes.page.html',
  styleUrls: ['./listado-clientes-pendientes.page.scss'],
})
export class ListadoClientesPendientesPage implements OnInit {
  flagListaVacia: boolean;
  listaUsuarios:Usuario[];

  constructor(private authSvc:AuthService,
    private utilidadesSvc:UtilidadesService,
    private firestore:FirestoreService,
    private router:Router,
    private mail:MailService) { }

  ngOnInit() {
    this.flagListaVacia = false;
    this.listaUsuarios = [];
    this.obtenerClientesInvalidad();
  }

  obtenerClientesInvalidad()
  {
    this.listaUsuarios = [];
    this.firestore.obtenerClientesInvalidados().then((data)=>{
      data.forEach((doc)=>{
        let usuario = doc.data() as Usuario;
        if(usuario.email != '' && usuario.email != undefined)
        {
          this.listaUsuarios.push({...usuario});
        }
      })
      console.log(this.listaUsuarios);
      this.listaUsuarios.length == 0 ? this.flagListaVacia = true : this.flagListaVacia = false;
    })
  }

  validar(index:number){
    let usuario = this.listaUsuarios[index];
    this.firestore.update(usuario.uid, {clienteValidado:true}).then((ok)=>{
      this.utilidadesSvc.successToast('Cliente validado');
      this.mail.enviarEmail(usuario.nombre, usuario.email, "Su usuario fue correctamente validado")
    }).catch((err)=>{
      this.utilidadesSvc.errorToast('Error al validar');
    });
    this.obtenerClientesInvalidad();
  }
 
}
