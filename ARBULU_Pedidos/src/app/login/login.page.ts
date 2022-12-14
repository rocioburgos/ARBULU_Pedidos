import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilidadesService } from '../servicios/utilidades.service';
import { FirestoreService } from '../servicios/firestore.service';
import { eEmpleado, eUsuario } from '../clases/usuario';
import { MailService } from '../servicios/mail.service';
import { NotificationService } from '../servicios/notification.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formulario!: FormGroup;
  usuario: any;

  constructor(
    public fb: FormBuilder,
    public afAuth: AuthService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private utilidadesSrv: UtilidadesService,
    private router: Router,
    private userSrv: FirestoreService,
    private mail: MailService,
    private pushNotSrv: NotificationService
  ) {
    // this.usuario = JSON.parse(localStorage.getItem('usuario_ARBULU'));
    // console.log(this.usuario);
    // if(!this.usuario){
    //   this.route.navigate(['home-cliente']);
    // }
  }

  BuildForm() {
    this.formulario = this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(6)]],
      Email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
    });
  }

  ngOnInit() {
    this.BuildForm();
  }

  async onLogin() {
    this.spinner.show();
    const Password = this.formulario.controls['Password'].value;
    const Email = this.formulario.controls['Email'].value;

    this.afAuth
      .SignIn(Email, Password)
      .then(async (res) => {
        const user = await (
          await this.userSrv.getUserByUid(res.user.uid).toPromise()
        ).data();

        if (user.tipo == 'cliente' && user.clienteValidado == '') {
          this.afAuth.signOut();
          this.utilidadesSrv.warningToast('Todav??a no fue confirmada su cuenta');
        } else if (
          (user.tipo == 'cliente' && user.clienteValidado == 'aceptado') ||
          user.tipo != 'cliente'
        ) {
          user.uid = res.user.uid;
          this.pushNotSrv.RegisterFCM(user.uid);
          localStorage.setItem(
            'usuario_ARBULU',
            JSON.stringify({
              uid: user.uid,
              email: Email,
              sesion: 'activa',
              tipo: user.tipo,
              tipoEmpleado: user.tipoEmpleado,
            })
          );

          setTimeout(() => {
            this.spinner.hide();
            switch (user.tipo) {
              case eUsuario.due??o:
              case eUsuario.supervisor:
                this.router.navigateByUrl('home-duenio');
                break;
              case eUsuario.cliente:
                this.router.navigateByUrl('qr-ingreso-local');
                break;
              case eUsuario.empleado:
                user.tipo_empleado == eEmpleado.mozo
                  ? this.router.navigateByUrl('home-metre')
                  : this.router.navigateByUrl('home-empleado');
                break;
            }
          }, 3000);
        } else if(user.tipo == 'cliente' && user.clienteValidado == 'rechazado'){
          this.afAuth.signOut();
          this.utilidadesSrv.errorToast('Su cuenta fue rechazada');
        }
      })
      .catch((err) => {
        setTimeout(() => {
          this.spinner.hide();
          err.code == 'auth/wrong-password'
            ? this.utilidadesSrv.errorToast('Uno o m??s campos son inv??lidos...')
            : this.utilidadesSrv.errorToast(
                'Ha ocurrido un error vuelva a intentar.'
              );
        }, 3000);
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  LoginUsuarioAnonimo() {
    this.spinner.show();
    this.afAuth.Login('leliseo89@hotmail.com', '123456').then((res) => {
      setTimeout(() => {
        this.spinner.hide();
        this.utilidadesSrv.successToast('Ingreso exitoso.', 2000);
        this.router.navigate(['home']);
      }, 3000);
    });
  }

  LoginUsuarioCliente() {
    this.spinner.show();
    this.afAuth.Login('rocioburgos00@gmail.com', '123456').then((res) => {
      setTimeout(() => {
        this.spinner.hide();
        this.utilidadesSrv.successToast('Ingreso exitoso.', 2000);
        this.router.navigate(['qr-ingreso-local']);
        //this.router.navigate(['home-cliente']);
      }, 3000);
    });
  }

  LoginUsuarioDuenio() {
    this.spinner.show();
    this.afAuth.Login('rocak89763@keshitv.com', '12345678').then((res: any) => {
      //this.pushNotSrv.RegisterFCM(res.user.uid);

      setTimeout(() => {
        this.spinner.hide();
        this.utilidadesSrv.successToast('Ingreso exitoso.', 2000);
        this.router.navigate(['home-duenio']);
      }, 3000);
    });
  }

  LoginUsuarioMozo() {
    this.spinner.show();
    this.afAuth.Login('xisomiw599@ktasy.com', '123456').then((res) => {
      setTimeout(() => {
        this.spinner.hide();
        this.utilidadesSrv.successToast('Ingreso exitoso.', 2000);
        this.router.navigate(['home-metre']);
      }, 3000);
    });
  }

  LoginUsuarioCocinero() {
    let token: string;

    this.spinner.show();
    this.afAuth.Login('sosat79897@hostovz.com', '123456').then((res) => {
      setTimeout(() => {
        this.spinner.hide();
        this.utilidadesSrv.successToast('Ingreso exitoso.', 2000);
        this.router.navigate(['home-empleado']);
      }, 3000);
    });
  }

  LoginUsuarioBartender() {
    this.spinner.show();
    this.afAuth.Login('jicewo5273@ktasy.com', '123456').then((res) => {
      setTimeout(() => {
        this.spinner.hide();
        this.utilidadesSrv.successToast('Ingreso exitoso.', 2000);
        this.router.navigate(['home-empleado']);
      }, 3000);
    });
  }

  Registrar() {
    this.route.navigate(['/alta-clientes']);
  }
}
