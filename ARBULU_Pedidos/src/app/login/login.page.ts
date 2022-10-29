import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formulario!: FormGroup;

  constructor(public fb: FormBuilder, public afAuth: AuthService) {
    
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
    this.afAuth.Login("leliseo89@hotmail.com", "123456");
  }

  LoginUsuarioCliente(){
    this.afAuth.Login("leliseo89@hotmail.com", "123456");
  }

  LoginUsuarioDuenio(){
    this.afAuth.Login("leliseo89@hotmail.com", "123456");
  }

  LoginUsuarioEmpleado(){
    this.afAuth.Login("leliseo89@hotmail.com", "123456");
  }



}
