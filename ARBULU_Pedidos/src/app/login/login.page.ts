import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { UtilidadesService } from '../servicios/utilidades.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formulario!: FormGroup;

  constructor(
    public fb: FormBuilder,
     public afAuth: AuthService, 
    private route: Router,
    private spinner: NgxSpinnerService,
    private utilidadesSrv:UtilidadesService,
    private router:Router
    ) {
    
  }

  BuildForm()
  {
    this.formulario=this.fb.group({

      Password:["", [Validators.required, Validators.minLength(6)]],
      Email:["", [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
   })
  }

  ngOnInit() {
    this.BuildForm();
  }

  async onLogin()
  {
    const Password = this.formulario.controls['Password'].value;
    const Email = this.formulario.controls['Email'].value;

    this.afAuth.Login(Email, Password);
  }

  LoginUsuarioAnonimo(){
    this.spinner.show();
    this.afAuth.Login("leliseo89@hotmail.com", "123456").then((res)=>{
      setTimeout(() => {
        this.spinner.hide();
        this.utilidadesSrv.successToast("Ingreso exitoso.",2000);
        this.router.navigate(['home']);
      }, 3000); 
    });
  }

  LoginUsuarioCliente(){
    this.spinner.show();
    this.afAuth.Login("leliseo89@hotmail.com", "123456").then((res)=>{
      setTimeout(() => {
        this.spinner.hide();
        this.utilidadesSrv.successToast("Ingreso exitoso.",2000);
        this.router.navigate(['home-cliente']);
      }, 3000); 
    });
  }

  LoginUsuarioDuenio(){
    this.spinner.show();
    this.afAuth.Login("leliseo89@hotmail.com", "123456").then((res)=>{
      setTimeout(() => {
        this.spinner.hide();
        this.utilidadesSrv.successToast("Ingreso exitoso.",2000);
        this.router.navigate(['home-duenio']);
      }, 3000); 
    });
  }

  LoginUsuarioEmpleado(){
    this.spinner.show();
    this.afAuth.Login("leliseo89@hotmail.com", "123456").then((res)=>{
      setTimeout(() => {
        this.spinner.hide();
        this.utilidadesSrv.successToast("Ingreso exitoso.",2000);
        this.router.navigate(['home-empleado']);
      }, 3000); 
    });
  }

  Registrar()
  {
    this.route.navigate(['/alta-clientes']);
  }



}
